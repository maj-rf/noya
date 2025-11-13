import type { SSPotential } from '@/types'
import { cn } from '@/lib/utils'

export const SSPotentials = ({
  potentials,
}: {
  potentials: Array<SSPotential>
}) => {
  return (
    <div className="whitespace-nowrap flex gap-1 m-4 p-4 w-full max-w-[1200px] mx-auto overflow-x-scroll">
      {potentials.map((p) => (
        <div
          key={p.id}
          className={cn(
            'border rounded-sm px-2 py-1 border-amber-400 bg-amber-200',
            {
              'border-pink-400 bg-pink-200': p.rarity === 0,
              'border-indigo-500 bg-indigo-300': p.rarity === 1,
            },
          )}
        >
          <h1>{p.name}</h1>
        </div>
      ))}
    </div>
  )
}
