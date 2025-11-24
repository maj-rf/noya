import { memo } from 'react'
import { X } from 'lucide-react'
import ResponsivePotential from './responsive-potential'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import type { SSPotential, SelectedPotential } from '@/types'
import { Item, ItemGroup } from '@/components/ui/item'

function SSPotentials({
  potentials,
  type,
  selected,
  k,
  setSelected,
}: {
  potentials: Array<SSPotential> | undefined
  type: 'main' | 'support'
  selected: Array<SelectedPotential> | null
  k: string
  setSelected: (k: string, potentials: Array<SelectedPotential>) => void
}) {
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
    <div className="pb-2">
      <h1 className="sm:max-w-5/6 w-full mx-auto px-4">
        {k === 'main' ? 'Main' : 'Support'}
      </h1>
      <ItemGroup className="flex-row overflow-x-scroll min-h-[170px] gap-1 p-2 sm:max-w-5/6 w-full mx-auto bg-blue-200">
        {selected
          ?.sort((a, b) => a.rarity - b.rarity)
          .map((s) => (
            <Item key={'selected' + s.id} className="flex flex-col p-0">
              <div className="relative">
                <ResponsivePotential
                  key={'selected' + s.imgId + s.id}
                  bgSrc={`./ss-vestige/vestige_${s.rarity}.png`}
                  iconSrc={`https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/${s.imgId}_A.png`}
                  name={s.name}
                  desc={s.briefDesc}
                />
                {s.rarity !== 0 && (
                  <div className="absolute -top-0.5 left-3 text-sm font-semibold text-indigo-500">
                    {s.level}
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-1 -right-1 rounded-full size-5 border"
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
            </Item>
          ))}
      </ItemGroup>
      <ItemGroup className="flex-row overflow-x-scroll gap-1 p-2 sm:max-w-5/6 w-full mx-auto">
        {filteredPotentials.map((p) => (
          <Item
            onClick={() => {
              addPotential(p)
            }}
            data-disabled={coreExceed}
            className={`rarity-${p.rarity} p-0`}
            key={p.id}
          >
            <ResponsivePotential
              key={p.imgId + p.id}
              bgSrc={`./ss-vestige/vestige_${p.rarity}.png`}
              iconSrc={`https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/${p.imgId}_A.png`}
              name={p.name}
              desc={p.briefDesc}
            />
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}

export default memo(SSPotentials)
