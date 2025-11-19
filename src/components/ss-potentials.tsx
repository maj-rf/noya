import { useState } from 'react'
import ResponsivePotential from './responsive-potential'
import { Slider } from './ui/slider'
import type { SSPotential, SelectedPotential } from '@/types'
import { Item, ItemGroup } from '@/components/ui/item'

export const SSPotentials = ({
  potentials,
  type,
}: {
  potentials: Array<SSPotential> | undefined
  type: 'main' | 'support'
}) => {
  const [selected, setSelected] = useState<Array<SelectedPotential>>([])
  if (!potentials) return
  const selectedIds = new Set(selected.map((s) => s.id))
  const filteredPotentials = potentials
    .filter(
      (p) => (p.type === type || p.type === 'common') && !selectedIds.has(p.id),
    )
    .sort((a, b) => a.rarity - b.rarity)

  const coreExceed =
    selected.length >= 2
      ? selected.reduce((a, b) => {
          return b.rarity === 0 ? a + 1 : a
        }, 0) === 2
      : false

  function addPotential(potential: SSPotential) {
    if (coreExceed && potential.rarity === 0) return
    const copy = [...selected]
    if (potential.rarity === 0) {
      setSelected(copy.concat({ ...potential, rarity: 0 }))
    } else
      setSelected(
        copy.concat({ ...potential, rarity: potential.rarity, level: 1 }),
      )
  }

  function removePotential(id: number) {
    const updated = selected.filter((s) => s.id !== id)
    setSelected(updated)
  }

  function updateLevel(level: number, id: number) {
    const updated = selected.map((s) => {
      return s.rarity && s.id === id ? { ...s, level } : s
    })
    setSelected(updated)
  }

  return (
    <div className="bg-indigo-500">
      <ItemGroup className="flex-row overflow-x-scroll md:min-h-[200px] min-h-[170px] gap-1 p-2 max-w-5/6 w-full mx-auto">
        {selected.map((s) => (
          <Item key={'selected' + s.id} className="flex flex-col p-0">
            <div onClick={() => removePotential(s.id)} className="relative">
              <ResponsivePotential
                key={'selected' + s.imgId + s.id}
                size="md:w-30 w-25"
                bgSrc={`./ss-vestige/vestige_${s.rarity}.png`}
                iconSrc={`https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/${s.imgId}_A.png`}
                name={s.name}
              />
              {s.rarity !== 0 && (
                <div className="absolute top-0 left-4 text-sm font-semibold text-indigo-500">
                  {s.level}
                </div>
              )}
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
      <ItemGroup className="flex-row overflow-x-scroll gap-1 mt-4 p-2 max-w-5/6 w-full mx-auto">
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
              size="md:w-30 w-25"
              bgSrc={`./ss-vestige/vestige_${p.rarity}.png`}
              iconSrc={`https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/${p.imgId}_A.png`}
              name={p.name}
            />
          </Item>
        ))}
      </ItemGroup>
    </div>
  )
}
