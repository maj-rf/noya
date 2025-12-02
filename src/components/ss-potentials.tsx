import { memo } from 'react'
import { InfoIcon, PlusIcon, X } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import ResponsivePotential from './responsive-potential'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipProvider,
  HybridTooltipTrigger,
} from './ui/hybrid-tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import type { PotentialPriority, Slot } from '@/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTrekkerStore } from '@/lib/trekker-store'

type SSPotentialsProps = {
  slot: Slot
  type: 'main' | 'support'
}

function SingleSelected({ slot, id }: { slot: Slot; id: number }) {
  const s = useTrekkerStore((state) => state.potentials[slot][id])
  const updateLevel = useTrekkerStore((sel) => sel.updateLevel)
  const removePotential = useTrekkerStore((sel) => sel.removePotential)
  const updatePriority = useTrekkerStore((sel) => sel.updatePriority)
  return (
    <div className="flex flex-col gap-2 justify-center">
      <HybridTooltip>
        <HybridTooltipTrigger asChild>
          <div className="relative">
            <ResponsivePotential
              key={'selected' + s.imgId + s.id}
              rarity={s.rarity}
              imgId={s.imgId}
              name={s.name}
              subIcon={s.subIcon}
            />
            {s.rarity !== 0 && (
              <div className="absolute -top-px left-3 text-xs font-semibold text-indigo-500">
                {s.level}
              </div>
            )}

            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-1 -right-1 rounded-full size-4 border border-white"
              onClick={() => removePotential(slot, s.id)}
            >
              <X className="size-3" />
            </Button>
          </div>
        </HybridTooltipTrigger>
        <HybridTooltipContent>
          <p>{s.briefDesc}</p>
        </HybridTooltipContent>
      </HybridTooltip>

      <div className="w-20 space-y-2">
        <Slider
          defaultValue={[1]}
          step={1}
          disabled={s.rarity === 0}
          min={1}
          max={6}
          onValueChange={(newValue: Array<number>) =>
            updateLevel(slot, s.id, newValue[0])
          }
        ></Slider>
        <Select
          disabled={s.rarity === 0}
          value={s.priority}
          onValueChange={(value) =>
            updatePriority(slot, id, value as PotentialPriority)
          }
        >
          <SelectTrigger className="text-[10px] w-full px-2" size="sm">
            <SelectValue placeholder="PotentialPriority" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem className="text-[10px]" value="Core">
              Core
            </SelectItem>
            <SelectItem className="text-[10px]" value="Medium">
              Medium
            </SelectItem>
            <SelectItem className="text-[10px]" value="Optional">
              Optional
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function SSPotentials({ slot, type }: SSPotentialsProps) {
  const potentials = useTrekkerStore((s) => s.trekkers[slot]?.potential)
  const selected = useTrekkerStore(
    useShallow((s) =>
      Object.values(s.potentials[slot])
        .sort((a, b) => a.rarity - b.rarity)
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
        (p.type === type || p.type === 'common') && !selected.includes(p.id),
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
            {selected.length === 0 ? (
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
              selected.map((s) => (
                <SingleSelected key={'selected' + s} slot={slot} id={s} />
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
