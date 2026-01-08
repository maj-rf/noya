import { memo } from 'react'
import { InfoIcon, PlusIcon, X } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import { getRouteApi } from '@tanstack/react-router'
import ResponsivePotential from './responsive-potential'
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
import type { PropsWithChildren } from 'react'
import type { PotentialPriority, Slot } from '@/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'
import { MAX_LEVEL, cn } from '@/lib/utils'

type SSPotentialsProps = {
  slot: Slot
  type: 'main' | 'support'
}

type SingleSelectedProps = { slot: Slot; id: number }

function SingleSelected({
  slot,
  id,
  children,
}: PropsWithChildren<SingleSelectedProps>) {
  const s = usePotentialStore((state) => state.potentials[slot][id])
  const updateLevel = usePotentialStore((sel) => sel.updateLevel)
  const removePotential = usePotentialStore((sel) => sel.removePotential)
  const updatePriority = usePotentialStore((sel) => sel.updatePriority)
  return (
    <div className="flex flex-col gap-2 justify-center">
      <div className="relative">
        {children}
        {s.rarity !== 0 && (
          <div
            className={cn(
              'absolute top-0 left-3 text-xs font-semibold tracking-tighter text-indigo-500',
              {
                'left-2': String(s.level).length >= 2,
              },
            )}
          >
            {s.level}
          </div>
        )}
        <Button
          variant="destructive"
          size="icon"
          aria-label="delete-card"
          className="absolute -top-1 -right-1 rounded-full size-4 border border-white"
          onClick={() => removePotential(slot, s.id)}
        >
          <X className="size-3" />
        </Button>
      </div>

      <div className="w-20 space-y-1">
        <Select
          disabled={s.rarity === 0}
          value={s.level ? String(s.level) : undefined}
          onValueChange={(value) => updateLevel(slot, s.id, value)}
        >
          <SelectTrigger className="text-[10px] w-full px-2" size="sm">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem className="text-[10px]" value="1+">
              1+
            </SelectItem>
            {[...Array(MAX_LEVEL)].map((_, index) => (
              <SelectItem
                className="text-[10px]"
                key={'level ' + String(index + 1)}
                value={String(index + 1)}
              >
                {index + 1}
              </SelectItem>
            ))}
            <SelectItem className="text-[10px]" value={`${MAX_LEVEL}+`}>
              {`${MAX_LEVEL}+`}
            </SelectItem>
          </SelectContent>
        </Select>
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
  const routeApi = getRouteApi('/')
  const { potentials: fetchedPotentials, characters } = routeApi.useLoaderData()
  const trekkerId = useTrekkerStore((s) => s.trekkers[slot])
  const selected = usePotentialStore(
    useShallow((s) =>
      Object.values(s.potentials[slot])
        .sort((a, b) => a.rarity - b.rarity)
        .map((p) => p.id),
    ),
  )
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

  if (!trekkerId) return
  const potentialList = fetchedPotentials[trekkerId]
  const potentials = Object.values(potentialList)

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
              <PlusIcon />{' '}
              {characters[trekkerId].name +
                `${type === 'main' ? ' Main' : ' Support'}`}
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
                      addPotential(slot, { id: p.id, rarity: p.rarity })
                    }}
                  >
                    <div
                      data-disabled={coreExceed}
                      className={`rarity-${p.rarity}`}
                    >
                      <ResponsivePotential
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
          <div className="flex min-h-[194px] gap-1 p-2">
            {selected.length === 0 ? (
              <div className="text-center self-center w-full">
                <div className="h-20 w-full">
                  <img
                    src="./shy.png"
                    alt="shy-penguin"
                    className="block w-full h-full object-contain"
                  />
                </div>
                Please choose potentials
              </div>
            ) : (
              selected.map((s) => {
                const p = potentialList[s]
                return (
                  <SingleSelected key={'selected' + s} slot={slot} id={s}>
                    <HybridTooltip>
                      <HybridTooltipTrigger asChild>
                        <div>
                          <ResponsivePotential
                            rarity={p.rarity}
                            imgId={p.imgId}
                            name={p.name}
                            subIcon={p.subIcon}
                          />
                        </div>
                      </HybridTooltipTrigger>
                      <HybridTooltipContent>
                        <p>{p.briefDesc}</p>
                      </HybridTooltipContent>
                    </HybridTooltip>
                  </SingleSelected>
                )
              })
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </HybridTooltipProvider>
  )
}

export default memo(SSPotentials)
