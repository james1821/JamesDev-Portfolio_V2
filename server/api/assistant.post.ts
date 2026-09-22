import { createHash } from 'node:crypto'
import { FieldValue } from 'firebase-admin/firestore'
import type { AssistantReply, PortfolioContent } from '#shared/types'
import { buildSystemPrompt } from '../utils/assistantPrompt'
import { seedContent } from '../utils/seedContent'
import { answerLocally } from '../utils/localAssistant'

/**
 * Free OpenRouter endpoints, tried in order. The free roster rotates, so a
 * single hard-coded model is a liability — if the first is rate limited or
 * retired we fall through to the next.
 */
const MODEL_CHAIN = [
  'openai/gpt-oss-20b:free',
  'google/gemma-3-27b-it:free',
  'meta-llama/llama-3.3-70b-instruct:free',
]

const SESSION_TTL_MS = 24 * 60 * 60 * 1000
const IP_DAILY_CEILING = 40

interface AssistantBody {
  message?: string
  sessionId?: string
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

function fail(reason: string, message: string, remaining: number, status: number) {
  throw createError({ statusCode: status, data: { reason, message, remaining } })
}

export default defineEventHandler(async (event): Promise<AssistantReply> => {
  const config = useRuntimeConfig()
  const limit = Number(config.assistantQuestionLimit) || 5
  const body = await readBody<AssistantBody>(event)

  const message = (body?.message ?? '').trim()
  const sessionId = (body?.sessionId ?? '').trim()

  if (!message || message.length > 500 || !/^[A-Za-z0-9_-]{8,64}$/.test(sessionId)) {
    fail('invalid', 'Send a question between 1 and 500 characters.', limit, 400)
  }

  const db = useFirestore()
  let used = 0

  if (db) {
    const ipKey = hashIp(getRequestIP(event, { xForwardedFor: true }) ?? 'unknown')
    const sessionRef = db.doc(`rateLimits/${sessionId}`)
    const ipRef = db.doc(`rateLimitsByIp/${ipKey}-${new Date().toISOString().slice(0, 10)}`)

    // A transaction keeps the counter correct when a visitor fires several
    // questions at once from multiple tabs.
    used = await db.runTransaction(async (tx) => {
      const [sessionSnap, ipSnap] = await Promise.all([tx.get(sessionRef), tx.get(ipRef)])

      const sessionCount = sessionSnap.exists ? (sessionSnap.data()?.count ?? 0) : 0
      const ipCount = ipSnap.exists ? (ipSnap.data()?.count ?? 0) : 0

      if (sessionCount >= limit) return -1
      if (ipCount >= IP_DAILY_CEILING) return -2

      tx.set(
        sessionRef,
        {
          count: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
          expiresAt: new Date(Date.now() + SESSION_TTL_MS),
        },
        { merge: true },
      )
      tx.set(ipRef, { count: FieldValue.increment(1), expiresAt: new Date(Date.now() + SESSION_TTL_MS) }, { merge: true })

      return sessionCount + 1
    })

    if (used === -1) {
      fail('rate_limited', `You have used all ${limit} questions for this session.`, 0, 429)
    }
    if (used === -2) {
      fail('rate_limited', 'This network has reached today’s limit. Try again tomorrow.', 0, 429)
    }
  }

  const remaining = Math.max(0, limit - used)

  const content = await $fetch<PortfolioContent>('/api/content').catch(() => seedContent)

  // No key configured, or every model in the chain failed — answer from the
  // live content directly rather than making the visitor wait on a retry.
  // This path never calls out to anything, so it can't itself be "busy."
  if (!config.openrouterApiKey) {
    return { answer: answerLocally(message, content), remaining, model: 'local' }
  }

  const notesDoc = db ? await db.doc('config/assistant').get().catch(() => null) : null
  const systemPrompt = buildSystemPrompt(content, notesDoc?.data()?.resumeText ?? '')

  const models = config.openrouterModel ? [config.openrouterModel, ...MODEL_CHAIN] : MODEL_CHAIN

  for (const model of models) {
    try {
      const result = await $fetch<{ choices?: { message?: { content?: string } }[] }>(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          retry: 0,
          timeout: 25_000,
          headers: {
            Authorization: `Bearer ${config.openrouterApiKey}`,
            'HTTP-Referer': config.siteUrl,
            'X-Title': `${content.personal.name} — Portfolio Assistant`,
          },
          body: {
            model,
            temperature: 0.3,
            max_tokens: 400,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message },
            ],
          },
        },
      )

      const answer = result.choices?.[0]?.message?.content?.trim()
      if (answer) return { answer, remaining, model }
    } catch {
      // Try the next model in the chain.
    }
  }

  // Every model was unavailable. Same guarantee as the no-key case above.
  return { answer: answerLocally(message, content), remaining, model: 'local' }
})
