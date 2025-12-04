import { useMemo } from 'react'
import { SSAvatar } from './ss-avatar'
import ResponsivePotential from './responsive-potential'
import type { RefObject } from 'react'
import type { SelectedPotential, Slot } from '@/types'
import { useTrekkerStore } from '@/lib/trekker-store'
import { cn } from '@/lib/utils'

const ListContainer = ({
  potentials,
}: {
  potentials: Array<SelectedPotential>
}) => {
  return (
    <ul className="flex flex-wrap w-[245px] items-start justify-center gap-0.5">
      {potentials.map((p) => (
        <li key={'preview' + p.id} className="relative">
          <ResponsivePotential
            rarity={p.rarity}
            imgId={p.imgId}
            name={p.name}
            subIcon={p.subIcon}
          />
          {p.rarity !== 0 && (
            <div className="absolute top-0 left-3 text-xs font-semibold text-indigo-500">
              {p.level}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

const PreviewRow = ({ slot }: { slot: Slot }) => {
  const selectedMap = useTrekkerStore((state) => state.potentials[slot])
  const potentials = useMemo(() => Object.values(selectedMap), [selectedMap])
  const trekker = useTrekkerStore((s) => s.trekkers[slot])
  const grouped = potentials.reduce(
    (acc, item) => {
      acc[item.priority].push(item)
      return acc
    },
    {
      Core: [] as typeof potentials,
      Medium: [] as typeof potentials,
      Optional: [] as typeof potentials,
    },
  )

  if (!trekker) return

  return (
    <tr>
      <td className="px-2 py-4 border-b space-y-2">
        <div className="h-[125px] w-[100px]">
          <SSAvatar id={trekker.id} />
        </div>
        <p
          className={cn('text-center rounded-sm font-medium bg-blue-900', {
            'bg-red-900': slot === 'main',
          })}
        >
          {slot === 'main' ? 'Main' : 'Support'}
        </p>
      </td>
      <td className="px-1 py-2 border-b">
        <ListContainer potentials={grouped.Core} />
      </td>
      <td className="px-1 py-2 border-b">
        <ListContainer potentials={grouped.Medium} />
      </td>
      <td className="px-1 py-2 border-b">
        <ListContainer potentials={grouped.Optional} />
      </td>
    </tr>
  )
}

export const Preview = ({ ref }: { ref: RefObject<HTMLElement | null> }) => {
  return (
    <div className="h-0 overflow-hidden">
      <section ref={ref} className="w-4xl rounded" id="preview">
        <table className="w-full bg-slate-800 shadow-lg rounded-lg table-auto border-collapse">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-2 py-2 text-center font-semibold">Trekker</th>
              <th className="px-2 py-2 text-center font-semibold">Core</th>
              <th className="px-2 py-2 text-center font-semibold">Medium</th>
              <th className="px-2 py-2 text-center font-semibold">Optional</th>
            </tr>
          </thead>
          <tbody>
            <PreviewRow slot="main" />
            <PreviewRow slot="sub1" />
            <PreviewRow slot="sub2" />
          </tbody>
        </table>
      </section>
    </div>
  )
}
