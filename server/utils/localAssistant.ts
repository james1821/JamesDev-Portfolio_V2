import type { PortfolioContent } from '#shared/types'

type Topic =
  | 'greeting'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'contact'
  | 'resume'
  | 'availability'
  | 'certifications'
  | 'current'
  | 'location'
  | 'summary'

/**
 * Keyword sets checked in order, first match wins. Ordered so more specific
 * intents (resume, contact) are tested before the broad ones (summary) they'd
 * otherwise be swallowed by.
 *
 * Matching rules per keyword:
 *  - contains a space  -> plain substring match ("based in", "right now")
 *  - ends with "*"     -> word-start match, so "project*" also catches
 *                         "projects" — only used where no unrelated English
 *                         word shares that prefix
 *  - otherwise         -> whole-word match only. This is the default and
 *                         matters most for short words: "hi" must not match
 *                         inside "his", "hire" must not match inside
 *                         "hireable" being treated as two different signals
 */
const TOPIC_KEYWORDS: [Topic, string[]][] = [
  ['greeting', ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening']],
  ['resume', ['resume', 'resumes', 'cv', 'curriculum vitae']],
  ['contact', ['contact', 'email', 'reach', 'linkedin', 'get in touch', 'connect']],
  [
    'availability',
    [
      'available',
      'availability',
      'hiring',
      'freelance',
      'freelancing',
      'open to work',
      'open to role',
      'looking for work',
      'opportunit*',
      'for hire',
      'hire*',
    ],
  ],
  [
    'location',
    ['located', 'location', 'based in', 'where is he', 'where are you', 'remote', 'timezone', 'time zone', 'live'],
  ],
  ['current', ['currently working', 'working on now', 'building now', 'right now', 'these days', 'working on right now']],
  ['certifications', ['certificat*', 'credential*', 'freecodecamp', 'hackerrank']],
  [
    'projects',
    ['project*', 'built', 'build', 'portfolio piece', 'work sample', 'github', 'shipped', 'app', 'website', 'demo'],
  ],
  [
    'experience',
    [
      'experience*',
      'work history',
      'worked',
      'work at',
      'job*',
      'career*',
      'role*',
      'compan*',
      'employer*',
      'background',
      'years of',
    ],
  ],
  ['skills', ['skill*', 'stack', 'tech', 'technolog*', 'language*', 'framework*', 'tool*', 'proficient*', 'know']],
  ['summary', ['who is', 'about him', 'about you', 'tell me about', 'summary', 'introduce', 'who are you']],
]

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function keywordMatches(keyword: string, lower: string): boolean {
  if (keyword.includes(' ')) return lower.includes(keyword)
  if (keyword.endsWith('*')) return new RegExp(`\\b${escapeRegex(keyword.slice(0, -1))}`, 'i').test(lower)
  return new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i').test(lower)
}

function detectTopic(message: string): Topic | null {
  const lower = message.toLowerCase()
  for (const [topic, keywords] of TOPIC_KEYWORDS) {
    if (keywords.some((keyword) => keywordMatches(keyword, lower))) return topic
  }
  return null
}

function listSentence(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function answerFor(topic: Topic, content: PortfolioContent): string {
  const { personal, skills, experience, projects, currentWork, certifications } = content
  const firstName = personal.name.split(' ')[0] ?? personal.name

  switch (topic) {
    case 'greeting':
      return `Hi! I can answer questions about ${firstName}'s experience, skills, projects, availability, or how to reach him. What would you like to know?`

    case 'resume':
      return personal.resume
        ? `You can download ${firstName}'s resume here: ${personal.resume}`
        : `A resume isn't posted yet — email ${personal.email} and he'll send one directly.`

    case 'contact': {
      const links = [`email (${personal.email})`, personal.linkedin && 'LinkedIn', personal.github && 'GitHub']
        .filter(Boolean)
        .join(', ')
      return `Best ways to reach ${firstName}: ${links}.`
    }

    case 'availability':
      return personal.availability
        ? `${firstName}'s current status: ${personal.availability}.`
        : `${firstName} hasn't posted an availability status — email ${personal.email} to ask directly.`

    case 'location':
      return personal.location
        ? `${firstName} is based in ${personal.location}.`
        : `Location isn't listed — email ${personal.email} to ask directly.`

    case 'current': {
      const active = currentWork.filter((w) => w.active)
      if (!active.length) return `Nothing is publicly listed as in progress right now.`
      return `Right now ${firstName} is working on ${listSentence(active.map((w) => w.title))}. ${active[0]?.description ?? ''}`.trim()
    }

    case 'certifications':
      if (!certifications.length) return `No certifications are listed yet.`
      return `Certifications: ${certifications.map((c) => `${c.title} (${c.issuer}, ${c.date})`).join('; ')}.`

    case 'projects': {
      if (!projects.length) return `No projects are listed yet.`
      const featured = projects.filter((p) => p.featured)
      const shown = (featured.length ? featured : projects).slice(0, 4)
      const lines = shown.map((p) => `${p.title} — ${p.description}`)
      return `A few things ${firstName} has built:\n${lines.map((l) => `• ${l}`).join('\n')}\n\nAsk about a specific one for more detail, or see the Projects page for the full list.`
    }

    case 'experience': {
      if (!experience.length) return `No work history is listed yet.`
      const lines = experience.map(
        (job) => `${job.role} at ${job.company} (${job.startDate}–${job.endDate})`,
      )
      return `${firstName}'s work history:\n${lines.map((l) => `• ${l}`).join('\n')}\n\nAsk about a specific role for more detail.`
    }

    case 'skills': {
      if (!skills.length) return `No skills are listed yet.`
      const byCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
        ;(acc[s.category] ??= []).push(s.name)
        return acc
      }, {})
      const lines = Object.entries(byCategory).map(([cat, names]) => `${cat}: ${names.join(', ')}`)
      return `${firstName}'s stack:\n${lines.map((l) => `• ${l}`).join('\n')}`
    }

    case 'summary':
    default:
      return `${personal.name} — ${personal.title}. ${personal.summary}`
  }
}

/**
 * Zero-network fallback used when every OpenRouter model is unavailable, or
 * when no API key is configured at all. Pattern-matches the question against
 * the live portfolio content rather than calling out to anything, so it can
 * never itself be "busy" — this is the answer a visitor gets when nothing
 * else could respond.
 */
export function answerLocally(message: string, content: PortfolioContent): string {
  const topic = detectTopic(message)

  if (!topic) {
    const firstName = content.personal.name.split(' ')[0] ?? content.personal.name
    return (
      `I can answer questions about ${firstName}'s experience, skills, projects, certifications, ` +
      `availability, or how to reach him. Try asking about one of those, or email ${content.personal.email} directly.`
    )
  }

  return answerFor(topic, content)
}
