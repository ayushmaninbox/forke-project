export function getRequiredLevel(budgetInPaise: number): number {
  if (budgetInPaise < 40000) return 1 // Under ₹400
  if (budgetInPaise < 90000) return 5 // Under ₹900
  if (budgetInPaise < 250000) return 10 // Under ₹2,500
  return 15 // Above
}
