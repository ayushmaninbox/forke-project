export interface User {
  id: string
  name: string
  email: string
  role: 'developer' | 'owner'
  level: number
  createdAt: Date
}

export interface Task {
  id: string
  title: string
  description: string
  budget: number
  currency: string
  status: string
  skillTags: string[]
  clientId: string
  claimantId?: string
  createdAt: Date
}

export interface Submission {
  id: string
  taskId: string
  developerId: string
  githubLink: string
  status: string
  createdAt: Date
}
