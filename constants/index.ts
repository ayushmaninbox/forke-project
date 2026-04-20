export const SKILL_TAGS = [
  'HTML/CSS',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'UI/UX',
  'REST API',
  'Bug Fix',
  'Database',
  'DevOps',
] as const

export const SKILL_TIER: Record<string, number> = {
  'HTML/CSS': 1,
  'JavaScript': 1,
  'UI/UX': 2,
  'React': 3,
  'Node.js': 3,
  'REST API': 3,
  'TypeScript': 4,
  'Next.js': 4,
  'Database': 5,
  'DevOps': 6,
  'Bug Fix': 1,
}

// Total cumulative XP required for each level
export const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 300,
  3: 800,
  4: 1600,
  5: 2800,
  8: 5500,
  10: 9000,
  15: 18000,
}

export const TASK_STATUS = {
  OPEN: 'open',
  CLAIMED: 'claimed',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  DISPUTED: 'disputed',
} as const
