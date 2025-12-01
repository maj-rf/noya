import { useMemo } from 'react'
import { SSAvatar } from './ss-avatar'
import ResponsivePotential from './responsive-potential'
import type { RefObject } from 'react'
import type { Slot, TAvatar } from '@/types'
import { useTrekkerStore } from '@/lib/trekker-store'

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
      <td className="px-4 py-4 border-b">
        <div className="h-[125px] w-[100px]">
          {avatar && <SSAvatar char={avatar} />}
        </div>
      </td>
      <td className="px-1 py-4 border-b">
        <ul className="flex flex-wrap gap-1 w-[200px] items-start justify-center">
          {grouped.Core.map((p) => (
            <li key={'preview' + p.id} className="relative">
              <ResponsivePotential
                rarity={p.rarity}
                imgId={p.imgId}
                name={p.name}
                subIcon={p.subIcon}
              />
              {p.rarity !== 0 && (
                <div className="absolute -top-0.5 left-3 text-sm text-center font-semibold text-indigo-500">
                  {p.level}
                </div>
              )}
            </li>
          ))}
        </ul>
      </td>
      <td className="px-1 py-4 border-b">
        <ul className="flex flex-wrap gap-1 w-[200px] items-start justify-center">
          {grouped.Medium.map((p) => (
            <li key={'preview' + p.id} className="relative">
              <ResponsivePotential
                rarity={p.rarity}
                imgId={p.imgId}
                name={p.name}
                subIcon={p.subIcon}
              />
              {p.rarity !== 0 && (
                <div className="absolute -top-0.5 left-3 text-sm text-center font-semibold text-indigo-500">
                  {p.level}
                </div>
              )}
            </li>
          ))}
        </ul>
      </td>
      <td className="px-1 py-4 border-b">
        <ul className="flex flex-wrap gap-1 w-[200px] justify-center items-center">
          {grouped.Optional.map((p) => (
            <li key={'preview' + p.id} className="relative">
              <ResponsivePotential
                rarity={p.rarity}
                imgId={p.imgId}
                name={p.name}
                subIcon={p.subIcon}
              />
              {p.rarity !== 0 && (
                <div className="absolute -top-0.5 left-3 text-sm text-center font-semibold text-indigo-500">
                  {p.level}
                </div>
              )}
            </li>
          ))}
        </ul>
      </td>
    </tr>
  )
}

export const Preview = ({
  avatar,
  ref,
}: {
  avatar: Record<Slot, TAvatar | null>
  ref: RefObject<HTMLElement | null>
}) => {
  return (
    <div className="h-0 overflow-hidden">
      <section ref={ref} className="w-3xl" id="preview">
        <table className="w-full bg-slate-800 shadow-lg rounded-lg overflow-hidden table-auto border-collapse">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-6 py-2 text-center font-semibold">Trekker</th>
              <th className="px-6 py-2 text-center font-semibold">Core</th>
              <th className="px-6 py-2 text-center font-semibold">Medium</th>
              <th className="px-6 py-2 text-center font-semibold">Optional</th>
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
