import { useState } from 'react'
import ResponsivePotential from './responsive-potential'
import type { SSPotential, SelectedPotential } from '@/types'

export const SSPotentials = ({
  potentials,
  type,
}: {
  potentials: Array<SSPotential> | undefined
  type: 'main' | 'support'
}) => {
  if (!potentials) return
  const [selected, setSelected] = useState<Array<SelectedPotential>>([])
  const filteredPotentials = potentials
    .filter((p) => p.type === type || p.type === 'common')
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
    if (potential.rarity !== 0) {
      if (selected.some((s) => s.id === potential.id)) return
      setSelected(copy.concat({ ...potential, level: 0 } as SelectedPotential))
    } else setSelected(copy.concat(potential as SelectedPotential))
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
    <div>
      Chosen:
      <div className="flex gap-1 overflow-x-scroll w-full max-w-lg mx-auto">
        {selected.map((s) => (
          <div key={'selected' + s.id} className="flex flex-col">
            <div onClick={() => removePotential(s.id)} className="relative">
              <ResponsivePotential
                key={'selected' + s.imgId + s.id}
                size="md:w-30 w-25"
                bgSrc={`./ss-vestige/vestige_${s.rarity}.png`}
                iconSrc={`https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/${s.imgId}_A.png`}
                name={s.name}
              />
              {s.rarity !== 0 && (
                <div className="absolute top-0 left-2 text-xs">{s.level}</div>
              )}
            </div>
            {s.rarity !== 0 && (
              <input
                className="md:w-30 w-25"
                value={s.level}
                onChange={(e) => updateLevel(Number(e.target.value), s.id)}
              ></input>
            )}
          </div>
        ))}
      </div>
      <div className="flex p-1 gap-1 overflow-x-scroll mt-4 max-w-lg mx-auto">
        {filteredPotentials.map((p) => (
          <div
            onClick={() => {
              addPotential(p)
            }}
            data-disabled={coreExceed}
            className={`rarity-${p.rarity}`}
            key={p.id}
          >
            <ResponsivePotential
              key={p.imgId + p.id}
              size="md:w-30 w-25"
              bgSrc={`./ss-vestige/vestige_${p.rarity}.png`}
              iconSrc={`https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/${p.imgId}_A.png`}
              name={p.name}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
