export interface Personal {
  name: string
  title: string
  summary: string
  photo: string
  email: string
  linkedin: string
  github: string
  resume: string
  location?: string
  availability?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  icon?: string
  order: number
}

export interface Experience {
  id: string
  company: string
  companyLogo?: string
  role: string
  startDate: string
  endDate: string
  description: string
  tech: string[]
  order: number
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  tech: string[]
  demo: string
  github: string
  featured: boolean
  order: number
}

export interface CurrentWork {
  id: string
  title: string
  description: string
  image: string
  active: boolean
  order: number
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issuerLogo?: string
  date: string
  description: string
  link: string
  order: number
}

export interface PortfolioContent {
  personal: Personal
  skills: Skill[]
  experience: Experience[]
  projects: Project[]
  currentWork: CurrentWork[]
  certifications: Certification[]
}

export type CollectionName = 'skills' | 'experience' | 'projects' | 'currentWork' | 'certifications'

export interface AssistantReply {
  answer: string
  remaining: number
  model: string
}

export interface AssistantError {
  reason: 'rate_limited' | 'unavailable' | 'invalid'
  message: string
  remaining: number
}
