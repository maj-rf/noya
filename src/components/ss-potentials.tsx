import { memo } from 'react'
import { InfoIcon, PlusIcon } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import ResponsivePotential from './responsive-potential'
import { Button } from './ui/button'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipProvider,
  HybridTooltipTrigger,
} from './ui/hybrid-tooltip'
import type { PotentialPriority, Slot } from '@/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTrekkerStore } from '@/lib/trekker-store'
import { SingleSelected } from './single-selected'

const PRIORITY_ORDER: Record<PotentialPriority, number> = {
  Core: 0,
  Medium: 1,
  Optional: 2,
}

type SSPotentialsProps = {
  slot: Slot
  type: 'main' | 'support'
}

function SSPotentials({ slot, type }: SSPotentialsProps) {
  const potentials = useTrekkerStore((s) => s.trekkers[slot]?.potential)
  const selectedIds = useTrekkerStore(
    useShallow((s) =>
      Object.values(s.potentials[slot])
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
          }
          return a.selectionTimestamp - b.selectionTimestamp
        })
        .map((p) => p.id),
    ),
  )
  const coreExceed = useTrekkerStore((s) => {
    const entries = Object.values(s.potentials[slot])
    let count = 0
    for (const pot of entries) {
      if (pot.rarity === 0) count++
      if (count === 2) return true
    }
    return false
  })

  const addPotential = useTrekkerStore((s) => s.addPotential)

  if (!potentials) return

  const filteredPotentials = potentials
    .filter(
      (p) =>
        (p.type === type || p.type === 'common') && !selectedIds.includes(p.id),
    )
    .sort((a, b) => a.rarity - b.rarity)

  return (
    <HybridTooltipProvider>
      <div className="w-full max-w-11/12 mx-auto mb-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="mb-2" size="sm">
              <PlusIcon /> {slot === 'main' ? 'Main' : 'Support'} Potentials
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" asChild>
            <ScrollArea
              className="w-screen sm:w-xl md:w-3xl"
              onFocusCapture={(e) => {
                e.stopPropagation()
              }}
            >
              <div className="flex w-max my-2 gap-1">
                {filteredPotentials.map((p) => (
                  <div
                    key={p.id}
                    className="relative"
                    onClick={() => {
                      if (coreExceed && p.rarity === 0) return
                      addPotential(slot, p)
                    }}
                  >
                    <div
                      data-disabled={coreExceed}
                      className={`rarity-${p.rarity}`}
                    >
                      <ResponsivePotential
                        key={p.imgId + p.id}
                        rarity={p.rarity}
                        imgId={p.imgId}
                        name={p.name}
                        subIcon={p.subIcon}
                      />
                    </div>
                    <HybridTooltip>
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
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <ScrollArea className="w-full rounded-sm bg-popover border">
          <div className="flex min-h-[180.267px] gap-1 p-2">
            {selectedIds.length === 0 ? (
              <div className="text-center self-center w-full">
                <div className="h-20 w-full">
                  <img
                    src="./shy.png"
                    className="block w-full h-full object-contain"
                  />
                </div>
                Please choose potentials
              </div>
            ) : (
              selectedIds.map((id) => (
                <SingleSelected key={'selected' + id} slot={slot} id={id} />
              ))
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </HybridTooltipProvider>
  )
}

export default memo(SSPotentials)
