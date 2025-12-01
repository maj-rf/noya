import { memo, useMemo } from 'react'
import { InfoIcon, PlusIcon, X } from 'lucide-react'
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
    <div className="flex flex-col gap-2">
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
              <div className="absolute -top-0.5 left-3 text-sm font-semibold text-indigo-500">
                {s.level}
              </div>
            )}

            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-1 -right-1 rounded-full size-5 border border-white"
              onClick={() => removePotential(slot, s.id)}
            >
              <X />
            </Button>
          </div>
        </HybridTooltipTrigger>
        <HybridTooltipContent>
          <p>{s.briefDesc}</p>
        </HybridTooltipContent>
      </HybridTooltip>

      <>
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
          <SelectTrigger className="text-xs p-2 w-full">
            <SelectValue placeholder="PotentialPriority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Core">Core</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Optional">Optional</SelectItem>
          </SelectContent>
        </Select>
      </>
    </div>
  )
}

function SSPotentials({ slot, type }: SSPotentialsProps) {
  const trekker = useTrekkerStore((s) => s.trekkers[slot])
  const selectedMap = useTrekkerStore((s) => s.potentials[slot])
  const addPotential = useTrekkerStore((s) => s.addPotential)
  const selected = useMemo(() => Object.values(selectedMap), [selectedMap])
  const potentials = trekker ? trekker.potential : []
  const filteredPotentials = useMemo(() => {
    const selectedIds = new Set(Object.keys(selectedMap).map(Number))
    return potentials
      .filter(
        (p) =>
          (p.type === type || p.type === 'common') && !selectedIds.has(p.id),
      )
      .sort((a, b) => a.rarity - b.rarity)
  }, [potentials, selectedMap, type])

  const coreExceed =
    selected.length >= 2
      ? selected.reduce((a, b) => {
          return b.rarity === 0 ? a + 1 : a
        }, 0) === 2
      : false

  if (!trekker) return

  return (
    <HybridTooltipProvider>
      <div className="w-full max-w-11/12 mx-auto mb-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="mb-2" size="sm">
              <PlusIcon /> {trekker.name} Potentials |{' '}
              {slot === 'main' ? 'Main' : 'Support'}
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
                  <div key={p.id} className="relative">
                    <div
                      onClick={() => {
                        if (coreExceed && p.rarity === 0) return
                        addPotential(slot, p)
                      }}
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
                          size="icon-sm"
                          className="absolute -top-0.5 -right-0.5 rounded-full size-5 border-2 border-background"
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
          <div className="flex min-h-[196.27px] gap-1 p-2">
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
              selected
                .sort((a, b) => a.rarity - b.rarity)
                .map((s) => (
                  <SingleSelected
                    key={'selected' + s.id}
                    slot={slot}
                    id={s.id}
                  />
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
