import { useState } from 'react'
import { InfoIcon } from 'lucide-react'
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipTrigger,
} from '../ui/hybrid-tooltip'
import { Button } from '../ui/button'
import ResponsivePotential from './responsive-potential'
import type { SSPotential, Slot } from '@/types'
import { usePotentialStore } from '@/lib/store'

export function PotentialSelection({
  filteredPotentials,
  slot,
}: {
  filteredPotentials: Array<SSPotential>
  slot: Slot
}) {
  const coreExceed = usePotentialStore((s) => {
    const entries = Object.values(s.potentials[slot])
    let count = 0
    for (const pot of entries) {
      if (pot.rarity === 0) count++
      if (count === 2) return true
    }
    return false
  })
  const addPotential = usePotentialStore((s) => s.addPotential)
  const [openId, setOpenId] = useState<number | null>(null)
  const handleOpenChange = (id: number) => (isOpen: boolean) => {
    if (isOpen) {
      setOpenId(id)
    } else if (openId === id) {
      setOpenId(null)
    }
  }
  return (
    <div className="flex w-max my-2 gap-1">
      {filteredPotentials.map((p) => (
        <div
          key={p.id}
          className="relative"
          onClick={() => {
            if (coreExceed && p.rarity === 0) return
            addPotential(slot, { id: p.id, rarity: p.rarity })
          }}
        >
          <div
            data-disabled={coreExceed}
            className={`rarity-${p.rarity} outline-[0.5px] rounded-xs`}
          >
            <ResponsivePotential
              rarity={p.rarity}
              imgId={p.imgId}
              name={p.name}
              subIcon={p.subIcon}
            />
          </div>
          <HybridTooltip
            open={openId === p.id}
            onOpenChange={handleOpenChange(p.id)}
          >
            <HybridTooltipTrigger asChild>
              <Button
                aria-label={p.name + 'description'}
                size="icon"
                className="absolute -top-1.5 -right-1 rounded-full size-5 border border-background"
              >
                <InfoIcon />
              </Button>
            </HybridTooltipTrigger>
            <HybridTooltipContent>
              <p>{p.briefDesc}</p>
            </HybridTooltipContent>
          </HybridTooltip>
        </div>
      ))}
    </div>
  )
}
