

import type {
  PortfolioData,
  Personal,
  TechItem,
  Experience,
  Project,
  Certification,
} from '~/types'

export interface AssistantListItem {
  label: string
  sub?: string
  href?: string
}

export interface AssistantReply {
  text: string
  items?: AssistantListItem[]
  note?: string
  code?: string
}

// ── Text helpers ───────────────────────────────────────────────
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'this', 'that', 'what', 'who',
  'your', 'you', 'tell', 'about', 'me', 'show', 'give', 'list', 'are',
  'all', 'have', 'has', 'did', 'was', 'were', 'can', 'could', 'please',
  'info', 'information', 'details', 'detail', 'any', 'does', 'just',
  'how', 'much', 'many', 'out', 'his', 'her', 'their', 'into', 'over',
])

// Generic words that show up inside titles/company names but aren't
// actually distinctive enough to identify a specific entity.
const EXTRA_GENERIC_WORDS = new Set([
  'web', 'developer', 'app', 'apps', 'application', 'applications',
  'website', 'websites', 'store', 'shop', 'platform', 'system',
  'systems', 'tool', 'tools', 'project', 'projects', 'basic',
])

function normalize(s: string): string {
  return s.toLowerCase().trim()
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasWord(message: string, phrase: string): boolean {
  const pattern = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'i')
  return pattern.test(message)
}

function matchScore(message: string, keywords: string[]): number {
  let score = 0
  for (const kw of keywords) {
    if (hasWord(message, kw)) score++
  }
  return score
}

function truncate(text: string, max = 130): string {
  const clean = text.trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max).trim() + '…'
}

/** Extracts distinctive lowercase tokens (length ≥ 3, or version-like "v2") from one or more strings. */
function entityKeyTerms(...sources: string[]): string[] {
  const combined = sources.join(' ').toLowerCase()
  const tokens = combined.match(/[a-z]{3,}|v\d+/g) ?? []
  const seen = new Set<string>()
  const out: string[] = []
  for (const t of tokens) {
    if (STOPWORDS.has(t) || EXTRA_GENERIC_WORDS.has(t) || seen.has(t)) continue
    seen.add(t)
    out.push(t)
  }
  return out
}

interface EntityMatch<T> {
  item: T
  matched: string[]
}

/** Finds the item whose key terms best overlap the visitor's message, requiring a confident match. */
function findBestMatch<T>(
  message: string,
  items: T[],
  keyFn: (item: T) => string[]
): EntityMatch<T> | null {
  let best: EntityMatch<T> | null = null

  for (const item of items) {
    const terms = keyFn(item)
    const matched = terms.filter((t) => hasWord(message, t))
    const confident = matched.length >= 2 || (matched.length === 1 && matched[0].length >= 6)
    if (!confident) continue
    if (!best || matched.length > best.matched.length) {
      best = { item, matched }
    }
  }

  return best
}

// ── Intent keyword sets ──────────────────────────────────────
const RAWJSON_WORDS = ['raw json', 'json data', 'show json', 'view json', 'raw data', 'source json']
const CONTACT_WORDS = ['contact', 'reach', 'email', 'e-mail', 'linkedin', 'github', 'social', 'hire', 'connect', 'resume', 'cv']
const SKILLS_WORDS = ['skill', 'skills', 'stack', 'technology', 'technologies', 'language', 'languages', 'framework', 'frameworks', 'proficient', 'tools', 'programming']
const EXPERIENCE_WORDS = ['experience', 'work', 'career', 'job', 'jobs', 'employer', 'employment', 'company', 'companies', 'professional', 'role', 'roles']
const PROJECTS_WORDS = ['project', 'projects', 'built', 'build', 'portfolio', 'app', 'apps', 'application', 'website', 'sites', 'made']
const CERT_WORDS = ['certificate', 'certificates', 'certification', 'certifications', 'credential', 'credentials', 'course', 'courses']
const ACHIEVEMENT_WORDS = ['achievement', 'achievements', 'award', 'awards', 'accomplishment', 'accomplishments']
const EDUCATION_WORDS = ['education', 'degree', 'university', 'college', 'school', 'study', 'studied', 'academic']
const SUMMARY_WORDS = ['summary', 'overview', 'rundown', 'everything', 'snapshot', 'recap']
const ABOUT_WORDS = ['about', 'who', 'introduce', 'introduction', 'background', 'bio', 'yourself']
const HELP_WORDS = ['help', 'capabilities', 'commands', 'options']
const GREETING_WORDS = ['hi', 'hello', 'hey', 'yo', 'sup', 'greetings', 'howdy']
const THANKS_WORDS = ['thanks', 'thank', 'appreciate', 'cheers']

// ── Reply builders ───────────────────────────────────────────
function buildGreetingReply(firstName: string): AssistantReply {
  return {
    text: `Hey there! I’m ${firstName}’s portfolio assistant. Ask me about skills, experience, projects, certifications, or how to get in touch — I only answer using ${firstName}’s actual portfolio data.`,
  }
}

function buildThanksReply(firstName: string): AssistantReply {
  return {
    text: `You’re welcome! Let me know if there’s anything else about ${firstName}’s work you’d like to explore.`,
  }
}

function buildHelpReply(): AssistantReply {
  return {
    text: 'I can help with:',
    items: [
      { label: 'Skills & Tech Stack' },
      { label: 'Work Experience' },
      { label: 'Projects' },
      { label: 'Certifications' },
      { label: 'Contact Info' },
    ],
  }
}

function buildAboutReply(personal: Personal): AssistantReply {
  return { text: `${personal.name} — ${personal.title}\n\n${personal.summary}` }
}

function buildSummaryReply(data: PortfolioData, firstName: string): AssistantReply {
  const categories = new Set(data.techstack.map((t) => t.category))
  return {
    text: `Quick overview of ${firstName}:`,
    items: [
      { label: data.personal.title },
      {
        label: `${data.experience.length} role${data.experience.length === 1 ? '' : 's'} listed`,
        sub: data.experience.map((e) => e.company.trim()).join(', '),
      },
      { label: `${data.projects.length} featured project${data.projects.length === 1 ? '' : 's'}` },
      { label: `${data.techstack.length} technologies across ${categories.size} categories` },
      { label: `${data.certifications.length} certification${data.certifications.length === 1 ? '' : 's'}` },
    ],
    note: 'Ask about any of these in more detail!',
  }
}

function buildSkillsReply(techstack: TechItem[], firstName: string): AssistantReply {
  const order: string[] = []
  const grouped = new Map<string, string[]>()

  for (const t of techstack) {
    if (!grouped.has(t.category)) {
      grouped.set(t.category, [])
      order.push(t.category)
    }
    grouped.get(t.category)!.push(t.name)
  }

  return {
    text: `${firstName}’s tech stack, grouped by category:`,
    items: order.map((cat) => ({ label: cat, sub: grouped.get(cat)!.join(', ') })),
  }
}

function buildExperienceListReply(experience: Experience[], firstName: string): AssistantReply {
  return {
    text: `${firstName}’s work experience:`,
    items: experience.map((e) => ({
      label: `${e.role.trim()} — ${e.company.trim()}`,
      sub: e.dates,
    })),
    note: 'Ask about a specific company for the full story.',
  }
}

function buildExperienceDetail(e: Experience, _firstName: string): AssistantReply {
  return {
    text: `${e.role.trim()} at ${e.company.trim()} (${e.dates})\n\n${e.description}`,
    items: [{ label: 'Tech used', sub: e.tech.join(', ') }],
  }
}

function buildProjectsListReply(projects: Project[], firstName: string): AssistantReply {
  return {
    text: `${firstName}’s featured projects:`,
    items: projects.map((p) => ({ label: p.title, sub: truncate(p.description, 110) })),
    note: 'Ask about a specific project for its tech stack, demo, and GitHub links.',
  }
}

function buildProjectDetail(p: Project, _firstName: string): AssistantReply {
  const items: AssistantListItem[] = [{ label: 'Tech stack', sub: p.tech.join(', ') }]
  if (p.demo) items.push({ label: 'Live Demo', href: p.demo })
  if (p.github) items.push({ label: 'GitHub Repo', href: p.github })

  return {
    text: `${p.title}\n\n${p.description}`,
    items,
  }
}

function buildCertificationsListReply(certifications: Certification[], firstName: string): AssistantReply {
  return {
    text: `${firstName}’s certifications:`,
    items: certifications.map((c) => ({ label: c.title.trim(), sub: `${c.issuer} · ${c.date}` })),
    note: 'Ask about a specific certification for more detail.',
  }
}

function buildCertificationDetail(c: Certification, _firstName: string): AssistantReply {
  const items: AssistantListItem[] = []
  if (c.link) items.push({ label: 'View credential', href: c.link })

  return {
    text: `${c.title.trim()} — ${c.issuer} (${c.date})\n\n${c.description}`,
    items,
  }
}

function buildAchievementsReply(certifications: Certification[], firstName: string): AssistantReply {
  return {
    text: `I don’t have a dedicated achievements list, but here are ${firstName}’s certifications — the closest match in my dataset:`,
    items: certifications.map((c) => ({ label: c.title.trim(), sub: `${c.issuer} · ${c.date}` })),
  }
}

function buildContactReply(personal: Personal, firstName: string): AssistantReply {
  const email = personal.email.startsWith('mailto:') ? personal.email : `mailto:${personal.email}`

  return {
    text: `Here’s how to reach ${firstName}:`,
    items: [
      { label: 'Email', sub: personal.email, href: email },
      { label: 'LinkedIn', href: personal.linkedin },
      { label: 'GitHub', href: personal.github },
      { label: 'Resume / CV', href: personal.resume },
    ],
  }
}

function buildRawJsonReply(data: PortfolioData): AssistantReply {
  const json = JSON.stringify(data, null, 2)
  const code = json.length > 1600 ? json.slice(0, 1600) + '\n…' : json

  return {
    text: 'Here’s the raw data straight from data.json:',
    code,
  }
}

const FALLBACK_REPLY: AssistantReply = {
  text: 'I don’t have that information in my dataset. Try asking about skills, experience, projects, certifications, or how to get in touch.',
}

const EDUCATION_REPLY: AssistantReply = {
  text: 'I don’t have that information in my dataset.',
}

// ── Main entry point ─────────────────────────────────────────
export function generateAssistantReply(rawQuery: string, data: PortfolioData): AssistantReply {
  const query = normalize(rawQuery)
  const firstName = data.personal.name.split(' ')[0] ?? data.personal.name

  if (!query) {
    return {
      text: `What would you like to know about ${firstName}? You can ask about skills, experience, projects, certifications, or contact info.`,
    }
  }

  // 1. Explicit request for the raw data file
  if (matchScore(query, RAWJSON_WORDS) > 0) {
    return buildRawJsonReply(data)
  }

  // 2. Specific entity lookup — a named project, company, or certification
  const projectMatch = findBestMatch(query, data.projects, (p) => entityKeyTerms(p.title))
  const expMatch = findBestMatch(query, data.experience, (e) => entityKeyTerms(e.company))
  const certMatch = findBestMatch(query, data.certifications, (c) => entityKeyTerms(c.title, c.issuer))

  type Candidate =
    | { type: 'project'; match: EntityMatch<Project> }
    | { type: 'experience'; match: EntityMatch<Experience> }
    | { type: 'certification'; match: EntityMatch<Certification> }

  const candidates: Candidate[] = []
  if (projectMatch) candidates.push({ type: 'project', match: projectMatch })
  if (expMatch) candidates.push({ type: 'experience', match: expMatch })
  if (certMatch) candidates.push({ type: 'certification', match: certMatch })

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.match.matched.length - a.match.matched.length)
    const top = candidates[0]

    if (top.type === 'project') return buildProjectDetail(top.match.item, firstName)
    if (top.type === 'experience') return buildExperienceDetail(top.match.item, firstName)
    return buildCertificationDetail(top.match.item, firstName)
  }

  // 3. General category-level intent
  const scores = {
    contact: matchScore(query, CONTACT_WORDS),
    skills: matchScore(query, SKILLS_WORDS),
    experience: matchScore(query, EXPERIENCE_WORDS),
    projects: matchScore(query, PROJECTS_WORDS),
    certifications: matchScore(query, CERT_WORDS),
    achievements: matchScore(query, ACHIEVEMENT_WORDS),
    education: matchScore(query, EDUCATION_WORDS),
    summary: matchScore(query, SUMMARY_WORDS),
    about: matchScore(query, ABOUT_WORDS),
    help: matchScore(query, HELP_WORDS),
    greeting: matchScore(query, GREETING_WORDS),
    thanks: matchScore(query, THANKS_WORDS),
  }

  type Intent = keyof typeof scores
  let bestIntent: Intent | null = null
  let bestScore = 0

  for (const key of Object.keys(scores) as Intent[]) {
    if (scores[key] > bestScore) {
      bestScore = scores[key]
      bestIntent = key
    }
  }

  switch (bestIntent) {
    case 'contact':
      return buildContactReply(data.personal, firstName)
    case 'skills':
      return buildSkillsReply(data.techstack, firstName)
    case 'experience':
      return buildExperienceListReply(data.experience, firstName)
    case 'projects':
      return buildProjectsListReply(data.projects, firstName)
    case 'certifications':
      return buildCertificationsListReply(data.certifications, firstName)
    case 'achievements':
      return buildAchievementsReply(data.certifications, firstName)
    case 'education':
      return EDUCATION_REPLY
    case 'summary':
      return buildSummaryReply(data, firstName)
    case 'about':
      return buildAboutReply(data.personal)
    case 'help':
      return buildHelpReply()
    case 'greeting':
      return buildGreetingReply(firstName)
    case 'thanks':
      return buildThanksReply(firstName)
    default:
      return FALLBACK_REPLY
  }
}
