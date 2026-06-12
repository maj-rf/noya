import { memo } from 'react'
import { PlusIcon } from 'lucide-react'
import { useShallow } from 'zustand/shallow'
import { getRouteApi } from '@tanstack/react-router'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import { Button } from '../ui/button'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipProvider,
  HybridTooltipTrigger,
} from '../ui/hybrid-tooltip'
import ResponsivePotential from './responsive-potential'
import { SingleSelected } from './single-selected'
import { PotentialSelection } from './potential-selection'
import type { Slot } from '@/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useLangStore, usePotentialStore, useTrekkerStore } from '@/lib/store'

type SSPotentialsProps = {
  slot: Slot
  type: 'main' | 'support'
}

function SSPotentials({ slot, type }: SSPotentialsProps) {
  const routeApi = getRouteApi('__root__')
  const { potentials: fetchedPotentials, characters } = routeApi.useLoaderData()
  const lang = useLangStore((s) => s.lang)
  const trekkerId = useTrekkerStore((s) => s.trekkers[slot])
  const selected = usePotentialStore(
    useShallow((s) =>
      s.potentials[slot]
        .sort((a, b) => {
          const aRank = a.rarity === 0 ? 0 : 1
          const bRank = b.rarity === 0 ? 0 : 1
          return aRank - bRank // rarity 0 first, 1 & 2 after
        })
        .map((p) => p.id),
    ),
  )
  const reorder = usePotentialStore((s) => s.reorder)

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
              {characters[trekkerId].name[lang] +
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
              <PotentialSelection
                filteredPotentials={filteredPotentials}
                slot={slot}
              />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <ScrollArea className="w-full rounded-sm bg-popover border">
          <div className="flex min-h-[194px] gap-1 p-2">
            {selected.length === 0 ? (
              <div className="flex flex-col w-full justify-center items-center">
                <div className="w-20 h-20">
                  <img src="./shy.png" alt="shy-penguin" />
                </div>
                <span>Please choose potentials</span>
              </div>
            ) : (
              <DragDropProvider
                onDragEnd={(event) => {
                  if (event.canceled) return
                  reorder(move(usePotentialStore.getState().potentials, event))
                }}
              >
                <p className="absolute top-0 text-[10px] text-muted-foreground">
                  *Click / Hold potential cards to drag and reorder
                </p>
                {selected.map((s, index) => {
                  const p = potentialList[s]
                  return (
                    <SingleSelected
                      key={'selected' + s}
                      slot={slot}
                      id={s}
                      idx={index}
                      rarity={p.rarity}
                    >
                      <HybridTooltip>
                        <HybridTooltipTrigger asChild>
                          <div className="outline-[0.5px] rounded-xs">
                            <ResponsivePotential
                              rarity={p.rarity}
                              imgId={p.imgId}
                              name={p.name[lang]}
                              subIcon={p.subIcon}
                            />
                          </div>
                        </HybridTooltipTrigger>
                        <HybridTooltipContent>
                          <p>{p.briefDesc[lang]}</p>
                        </HybridTooltipContent>
                      </HybridTooltip>
                    </SingleSelected>
                  )
                })}
              </DragDropProvider>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </HybridTooltipProvider>
  )
}

export default memo(SSPotentials)
