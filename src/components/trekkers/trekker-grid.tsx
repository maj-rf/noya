import { getRouteApi } from '@tanstack/react-router'
import { useShallow } from 'zustand/shallow'
import { MinusIcon, PlusIcon } from 'lucide-react'
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
import type { Slot } from '@/types'
import { useLangStore, usePotentialStore, useTrekkerStore } from '@/lib/store'
import { MAX_LEVEL } from '@/lib/utils'

type SSPotentialsProps = {
  slot: Slot
  type: 'main' | 'support'
}

export function TrekkerGrid({ slot, type }: SSPotentialsProps) {
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
  const reorder = usePotentialStore((s) => s.reorder)

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
            return (
              <div key={p.id} className="relative w-full">
                {selected.includes(p.id) ? (
                  <Button
                    className="absolute top-0 right-0 m-auto z-10 rounded-full"
                    size="icon-xs"
                    onClick={() => remove(slot, p.id)}
                  >
                    <MinusIcon />
                  </Button>
                ) : (
                  <Button
                    className="absolute top-0 right-0 m-auto z-10 rounded-full"
                    size="icon-xs"
                    onClick={() => add(slot, p)}
                    disabled={coreExceed}
                  >
                    <PlusIcon />
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
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-[80px_80px_80px] auto-rows-[102px] gap-1">
          {filteredPotentials.slice(4).map((s) => {
            const p = potentialList[s.id]
            return (
              <div key={p.id} className="relative w-full">
                {selected.includes(p.id) ? (
                  <Button
                    className="absolute top-0 right-0 m-auto z-10 rounded-full"
                    size="icon-xs"
                    onClick={() => remove(slot, p.id)}
                  >
                    <MinusIcon />
                  </Button>
                ) : (
                  <Button
                    className="absolute top-0 right-0 m-auto z-10 rounded-full"
                    size="icon-xs"
                    onClick={() => add(slot, p)}
                    disabled={coreExceed}
                  >
                    <PlusIcon />
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
                <div className="absolute top-0 bg-transparent flex rounded-sm">
                  <Select
                    value={s.level ? String(s.level) : undefined}
                    onValueChange={(value) => updateLevel(slot, s.id, value)}
                    defaultValue={'6'}
                  >
                    <SelectTrigger
                      className="text-[10px] justify-start gap-0.5 pl-2 pr-0 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 text-mauve-800 bg-transparent data-[size=sm]:h-3"
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
                      <SelectItem
                        className="text-[10px]"
                        value={`${MAX_LEVEL}+`}
                      >
                        {`${MAX_LEVEL}+`}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="bg-white w-fit px-1">
                    <Select
                      // value={s.priority}
                      onValueChange={() => {}}
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
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
