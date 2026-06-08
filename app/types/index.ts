export interface Personal {
  name: string
  title: string
  summary: string
  photo: string
  email: string
  linkedin: string
  github: string
  resume: string
}

export interface TechItem {
  name: string
  category: string
  icon?: string
}

export interface Experience {
  company: string
  companyLogo?: string
  role: string
  dates: string
  description: string
  tech: string[]
}

export interface Project {
  title: string
  description: string
  image: string
  tech: string[]
  demo: string
  github: string
}

export interface Certification {
  title: string
  issuer: string
  issuerLogo?: string
  date: string
  description: string
  link: string
}

export interface PortfolioData {
  personal: Personal
  techstack: TechItem[]
  experience: Experience[]
  projects: Project[]
  certifications: Certification[]
}
