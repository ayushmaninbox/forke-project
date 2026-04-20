import { SKILL_TIER, LEVEL_THRESHOLDS } from '@/constants'

export function getLevelFromXp(xp: number): number {
  const levels = Object.keys(LEVEL_THRESHOLDS)
    .map(Number)
    .sort((a, b) => b - a) // Sort descending

  for (const lvl of levels) {
    if (xp >= LEVEL_THRESHOLDS[lvl]) {
      return lvl
    }
  }
  return 1
}

export function getRequiredLevelForTask(skillTags: string[] | null): number {
  if (!skillTags || skillTags.length === 0) return 1
  
  const tiers = skillTags.map(tag => SKILL_TIER[tag] || 1)
  return Math.max(...tiers)
}

/**
 * Calculates base XP based on budget tier (in Paise)
 */
export function calculateBaseXp(budgetInPaise: number): number {
  const inInr = Math.floor(budgetInPaise / 100)
  if (inInr < 400) return 50
  if (inInr < 900) return 100
  if (inInr < 2500) return 200
  return 350
}

// Deprecated: Use getRequiredLevelForTask instead
export function getRequiredLevel(budgetInPaise: number): number {
  if (budgetInPaise < 40000) return 1
  if (budgetInPaise < 90000) return 3
  if (budgetInPaise < 250000) return 5
  return 10
}
