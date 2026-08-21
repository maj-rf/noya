import type { SSPotential, SelectedPotential } from '@/types'
import { MAX_LEVEL } from '@/lib/utils'

export function getSelectedPots(
  pots: Record<string, SSPotential>,
  type: 'main' | 'support',
): Array<SelectedPotential> {
  return Object.values(pots)
    .filter((p) => p.type === type || p.type === 'common')
    .map((o) => {
      return o.rarity === 0
        ? { id: o.id, rarity: 0, priority: 'Core', picked: false }
        : {
            id: o.id,
            rarity: o.rarity,
            level: MAX_LEVEL,
            priority: 'Medium',
            picked: false,
          }
    })
}
