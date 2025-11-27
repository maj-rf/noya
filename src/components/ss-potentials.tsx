import { memo } from 'react'
import { PlusIcon, X } from 'lucide-react'
import ResponsivePotential from './responsive-potential'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import type { SSPotential, SelectedPotential } from '@/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type SSPotentialsProps = {
  potentials: Array<SSPotential> | undefined
  type: 'main' | 'support'
  selected: Array<SelectedPotential> | null
  k: string
  setSelected: (k: string, potentials: Array<SelectedPotential>) => void
}

function SSPotentials({
  potentials,
  type,
  selected,
  k,
  setSelected,
}: SSPotentialsProps) {
  if (!potentials) return
  const selectedIds = selected && new Set(selected.map((s) => s.id))
  const filteredPotentials = potentials
    .filter(
      (p) =>
        (p.type === type || p.type === 'common') && !selectedIds?.has(p.id),
    )
    .sort((a, b) => a.rarity - b.rarity)

  const coreExceed =
    selected && selected.length >= 2
      ? selected.reduce((a, b) => {
          return b.rarity === 0 ? a + 1 : a
        }, 0) === 2
      : false

  function addPotential(potential: SSPotential) {
    if (coreExceed && potential.rarity === 0) return
    const copy = selected ? [...selected] : []
    if (potential.rarity === 0) {
      setSelected(k, copy.concat({ ...potential, rarity: 0 }))
    } else
      setSelected(
        k,
        copy.concat({ ...potential, rarity: potential.rarity, level: 1 }),
      )
  }

  function removePotential(id: number) {
    const updated = selected?.filter((s) => s.id !== id)
    if (!updated) return
    setSelected(k, updated)
  }

  function updateLevel(level: number, id: number) {
    const updated = selected?.map((s) => {
      return s.rarity && s.id === id ? { ...s, level } : s
    })
    if (!updated) return
    setSelected(k, updated)
  }

  return (
    <div className="w-full max-w-11/12 mx-auto mb-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="mb-2" size="sm">
            <PlusIcon /> {k === 'main' ? 'Main' : 'Support'} Potentials
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" asChild>
          <ScrollArea className="w-screen sm:w-3xl">
            <div className="flex w-max my-2 gap-1">
              {filteredPotentials.map((p) => (
                <div
                  onClick={() => {
                    addPotential(p)
                  }}
                  data-disabled={coreExceed}
                  className={`rarity-${p.rarity} p-0`}
                  key={p.id}
                >
                  <ResponsivePotential
                    key={p.imgId + p.id}
                    rarity={p.rarity}
                    imgId={p.imgId}
                    name={p.name}
                    subIcon={p.subIcon}
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <ScrollArea className="w-full rounded-sm bg-popover border">
        <div className="flex min-h-[170px] gap-1 p-2">
          {!selected || selected.length === 0 ? (
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
                <div
                  key={'selected' + s.id}
                  className="flex flex-wrap shrink-0 py-2"
                >
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
                      onClick={() => removePotential(s.id)}
                    >
                      <X />
                    </Button>
                  </div>
                  {s.rarity !== 0 && (
                    <Slider
                      className="w-full"
                      defaultValue={[1]}
                      step={1}
                      min={1}
                      max={6}
                      onValueChange={(newValue: Array<number>) =>
                        updateLevel(newValue[0], s.id)
                      }
                    ></Slider>
                  )}
                </div>
              ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

export default memo(SSPotentials)
