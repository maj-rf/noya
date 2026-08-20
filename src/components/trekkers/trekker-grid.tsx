import { getRouteApi } from '@tanstack/react-router'
import { useShallow } from 'zustand/shallow'
import { MinusIcon, ThumbsUpIcon } from 'lucide-react'
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

function SingleSelected({ slot, p }: { slot: Slot; p: SSPotential }) {
  const sel = usePotentialStore((s) =>
    s.potentials[slot].find((sp) => sp.id === p.id),
  )
  const lang = useLangStore((s) => s.lang)
  const selected = usePotentialStore(
    useShallow((s) => s.potentials[slot].map((sp) => sp.id)),
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

  const add = usePotentialStore((s) => s.addPotential)
  const remove = usePotentialStore((s) => s.removePotential)
  const updateLevel = usePotentialStore((s) => s.updateLevel)
  const updatePriority = usePotentialStore((s) => s.updatePriority)
  // const reorder = usePotentialStore((s) => s.reorder)

  return (
    <div key={p.id} className="relative w-full">
      {selected.includes(p.id) ? (
        <Button
          className="absolute -top-1 -right-0.5 m-auto z-10 rounded-full"
          size="icon-xs"
          onClick={() => remove(slot, p.id)}
        >
          <MinusIcon />
        </Button>
      ) : (
        <Button
          className="absolute -top-1 -right-0.5 m-auto z-10 rounded-full"
          size="icon-xs"
          onClick={() => add(slot, p)}
          disabled={p.rarity === 0 && coreExceed}
        >
          <ThumbsUpIcon />
        </Button>
      )}
      <div
        data-selected={selected.includes(p.id)}
        className="opacity-60 data-[selected=true]:opacity-100"
      >
        <ResponsivePotential
          size="w-20 sm:w-full"
          rarity={p.rarity}
          imgId={p.imgId}
          name={p.name[lang]}
        />
      </div>
      {p.rarity !== 0 && (
        <div className="absolute top-0 bg-white flex w-full rounded-sm">
          {sel && (
            <Select
              value={sel.level ? String(sel.level) : undefined}
              onValueChange={(value) => updateLevel(slot, p.id, value)}
              defaultValue={'6'}
            >
              <SelectTrigger
                className="text-[10px] justify-start gap-0.5 pl-1 pr-0 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 text-mauve-800 bg-transparent data-[size=sm]:h-3"
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
          <div className="bg-white w-fit px-1">
            {sel && (
              <Select
                value={sel.priority}
                onValueChange={(value) => {
                  updatePriority(slot, sel.id, value as PotentialPriority)
                }}
                defaultValue="Medium"
              >
                <SelectTrigger
                  className="text-[10px] justify-start gap-0.5 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-transparent p-0 text-mauve-800 data-[size=sm]:h-3.25"
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

export function TrekkerGrid({ slot, type }: SSPotentialsProps) {
  const routeApi = getRouteApi('__root__')
  const { potentials: fetchedPotentials } = routeApi.useLoaderData()
  const trekkerId = useTrekkerStore((s) => s.trekkers[slot])
  if (!trekkerId) return
  const potentialList = fetchedPotentials[trekkerId]
  const potentials = Object.values(potentialList)
  const filteredPotentials = potentials
    .filter((p) => p.type === type || p.type === 'common')
    .sort((a, b) => a.rarity - b.rarity)

  return (
    <section className="mt-5">
      <div className="flex justify-center gap-1 w-full max-w-lg mx-auto p-1 bg-muted">
        <div className="grid grid-cols-[80px_80px] auto-rows-[102px] gap-1">
          <div className="col-span-2 row-span-2">
            <SSTrekker id={trekkerId} />
          </div>
          {filteredPotentials.slice(0, 4).map((s) => {
            const p = potentialList[s.id]
            return <SingleSelected key={p.id} slot={slot} p={p} />
          })}
        </div>
        <div className="grid grid-cols-[80px_80px_80px] auto-rows-[102px] gap-1">
          {filteredPotentials.slice(4).map((s) => {
            const p = potentialList[s.id]
            return <SingleSelected key={p.id} slot={slot} p={p} />
          })}
        </div>
      </div>
    </section>
  )
}
