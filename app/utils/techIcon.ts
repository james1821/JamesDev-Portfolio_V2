import type { Skill } from '#shared/types'

// Tech tags on projects/experience aren't always written the same way the
// Stack section names them (e.g. "Vue" vs "Vue 3", "Nuxt 3" vs "Nuxt"), so
// drop a trailing version number before comparing.
function normalize(name: string) {
  return name.trim().toLowerCase().replace(/\s+\d+(\.\d+)*$/, '')
}

/**
 * Finds the icon already defined for a skill in the Stack section that
 * matches a given technology name, so tech lists elsewhere can reuse the
 * same logos instead of falling back to plain text.
 */
export function findTechIcon(tech: string, skills: Skill[] | undefined): string | undefined {
  if (!skills?.length) return undefined
  const target = normalize(tech)
  return skills.find((skill) => normalize(skill.name) === target)?.icon
}
