import { getRouteApi } from '@tanstack/react-router'
import { MinusIcon, ThumbsUpIcon } from 'lucide-react'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { move } from '@dnd-kit/helpers'
import ResponsivePotential from '../potentials/responsive-potential'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import { SSTrekker } from './ss-trekker'
import type { PotentialPriority, SSPotential, Slot } from '@/types'
import { useLangStore, usePotentialStore, useTrekkerStore } from '@/lib/store'
import { MAX_LEVEL } from '@/lib/utils'

type SSPotentialsProps = {
  slot: Slot
  type: 'main' | 'support'
}

function SingleSelected({
  slot,
  p,
  idx,
}: {
  slot: Slot
  p: SSPotential
  idx: number
}) {
  const sel = usePotentialStore((s) =>
    s.potentials[slot].find((sp) => sp.id === p.id),
  )
  const lang = useLangStore((s) => s.lang)
  const coreExceed = usePotentialStore((s) => {
    const entries = Object.values(s.potentials[slot])
    let count = 0
    for (const pot of entries) {
      if (pot.rarity === 0 && pot.picked) count++
      if (count === 2) return true
    }
    return false
  })

  const toggle = usePotentialStore((s) => s.togglePotential)
  const updateLevel = usePotentialStore((s) => s.updateLevel)
  const updatePriority = usePotentialStore((s) => s.updatePriority)

  const { ref, isDragging } = useSortable({
    id: p.id,
    index: idx,
    disabled: p.rarity === 0,
  })

  return (
    <div
      ref={ref}
      className={`relative w-full ease-in-out transition-transform duration-300 ${isDragging && 'rotate-6 outline-blue-300 outline-3'}`}
    >
      {sel?.picked ? (
        <Button
          className="absolute -top-1 -right-1 m-auto z-10 rounded-full"
          size="icon-xs"
          onClick={() => toggle(slot, p)}
        >
          <MinusIcon />
        </Button>
      ) : (
        <Button
          className="absolute -top-1 -right-1 m-auto z-10 rounded-full"
          size="icon-xs"
          onClick={() => toggle(slot, p)}
          disabled={p.rarity === 0 && coreExceed}
        >
          <ThumbsUpIcon />
        </Button>
      )}
      <div
        data-selected={sel?.picked}
        className="opacity-60 data-[selected=true]:opacity-100"
      >
        <ResponsivePotential
          size="w-18"
          rarity={p.rarity}
          imgId={p.imgId}
          name={p.name[lang]}
        />
      </div>
      {p.rarity !== 0 && (
        <div className="absolute top-0 bg-white flex w-full rounded-sm">
          {sel?.picked && (
            <Select
              value={sel.level ? String(sel.level) : undefined}
              onValueChange={(value) => updateLevel(slot, p.id, value)}
              defaultValue={'6'}
            >
              <SelectTrigger
                className="text-[10px] justify-start gap-0 pl-1 pr-0 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 text-mauve-800 bg-transparent data-[size=sm]:h-3"
                size="sm"
              >
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
          )}
          <div className="bg-white px-0.5">
            {sel?.picked && (
              <Select
                value={sel.priority}
                onValueChange={(value) => {
                  updatePriority(slot, sel.id, value as PotentialPriority)
                }}
                defaultValue="Medium"
              >
                <SelectTrigger
                  className="text-[10px] justify-start gap-0 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-transparent p-0 text-mauve-800 data-[size=sm]:h-3.25"
                  size="sm"
                >
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem className="text-[10px]" value="Core">
                    Core
                  </SelectItem>
                  <SelectItem className="text-[10px]" value="Medium">
                    Med
                  </SelectItem>
                  <SelectItem className="text-[10px]" value="Low">
                    Low
                  </SelectItem>
                  <SelectItem className="text-[10px]" value="Optional">
                    Opt
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function TrekkerGrid({ slot }: SSPotentialsProps) {
  const routeApi = getRouteApi('__root__')
  const { potentials: fetchedPotentials } = routeApi.useLoaderData()
  const trekkerId = useTrekkerStore((s) => s.trekkers[slot])
  const update = usePotentialStore((s) => s.update)
  const pots = usePotentialStore((s) => s.potentials[slot])
  if (!trekkerId) return
  const potentialList = fetchedPotentials[trekkerId]

  return (
    <section className="mt-5">
      <div className="flex justify-center gap-1 w-full max-w-lg mx-auto p-1 bg-muted">
        <div className="grid grid-cols-[72px_72px_72px_72px] auto-rows-[91.8px] gap-1">
          <div className="col-span-2 row-span-2">
            <SSTrekker id={trekkerId} />
          </div>
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) return
              // not working
              update(
                slot,
                move(usePotentialStore.getState().potentials[slot], event),
              )
            }}
          >
            {pots.map((s, index) => {
              const p = potentialList[s.id]
              return <SingleSelected key={p.id} slot={slot} p={p} idx={index} />
            })}
          </DragDropProvider>
        </div>
      </div>
    </section>
  )
}
