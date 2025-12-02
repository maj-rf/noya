import { useMemo } from 'react'
import { SSAvatar } from './ss-avatar'
import ResponsivePotential from './responsive-potential'
import type { RefObject } from 'react'
import type { SelectedPotential, Slot, TAvatar } from '@/types'
import { useTrekkerStore } from '@/lib/trekker-store'
import { getTrekkersWithoutPotentials } from '@/lib/utils'

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

const PreviewRow = ({
  avatar,
  slot,
}: {
  avatar: TAvatar | null
  slot: Slot
}) => {
  const selectedMap = useTrekkerStore((state) => state.potentials[slot])
  const potentials = useMemo(() => Object.values(selectedMap), [selectedMap])

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

  return (
    <tr>
      <td className="px-2 py-4 border-b">
        <div className="h-[125px] w-[100px]">
          {avatar && <SSAvatar char={avatar} />}
        </div>
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
  const trekkers = useTrekkerStore((state) => state.trekkers)
  const avatar = getTrekkersWithoutPotentials(trekkers)
  return (
    <div className="">
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
            <PreviewRow avatar={avatar.main} slot="main" />
            <PreviewRow avatar={avatar.sub1} slot="sub1" />
            <PreviewRow avatar={avatar.sub2} slot="sub2" />
          </tbody>
        </table>
      </section>
    </div>
  )
}
