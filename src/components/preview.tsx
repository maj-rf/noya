import { useMemo, useRef, useTransition } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import ResponsivePotential from './potentials/responsive-potential'
import { Button } from './ui/button'
import { BaseTrekker } from './trekkers/base-trekker'
import type { SelectedPotential, Slot } from '@/types'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'
import { cn, downloadImage } from '@/lib/utils'

const ListContainer = ({
  potentials,
  id,
}: {
  potentials: Array<SelectedPotential>
  id: number
}) => {
  const routeApi = getRouteApi('__root__')
  const { potentials: fetchedPotentials } = routeApi.useLoaderData()
  return (
    <ul className="flex flex-wrap w-[245px] justify-center gap-0.5 relative">
      {potentials.map((p) => {
        const current = fetchedPotentials[id][p.id]
        return (
          <li key={'preview' + p.id} className="relative">
            <ResponsivePotential
              rarity={current.rarity}
              imgId={current.imgId}
              name={current.name}
              subIcon={current.subIcon}
            />
            {p.rarity !== 0 && (
              <div
                className={cn(
                  'absolute top-0 left-3 text-xs font-semibold tracking-tighter text-slate-600',
                  {
                    'left-2': String(p.level).length >= 2,
                  },
                )}
              >
                {p.level}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

const PreviewRow = ({ slot }: { slot: Slot }) => {
  const routeApi = getRouteApi('__root__')
  const { characters } = routeApi.useLoaderData()
  const selectedMap = usePotentialStore((state) => state.potentials[slot])
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
  const char = characters[trekker]
  return (
    <tr className="border-b last:border-b-0 border-b-slate-600">
      <td className="px-2 py-4  space-y-2">
        <div className="h-[125px] w-[100px]">
          <BaseTrekker char={char}>
            <img
              alt={char.name + 'element preview'}
              className="size-6 absolute -top-1 -right-1"
              src={`./ss-element/${char.element}.webp`}
            />
            <p
              className={cn(
                '[clip-path:polygon(0_0,100%_0,90%_100%,0_100%)] absolute -top-0.75 text-center text-sm text-white tracking-tighter pr-3 pl-1 bg-indigo-500',
                {
                  'bg-rose-500': slot === 'main',
                },
              )}
            >
              {slot === 'main' ? 'Main' : 'Support'}
            </p>
          </BaseTrekker>
        </div>
      </td>
      <td className="px-1 py-2 border-slate-600">
        <ListContainer potentials={grouped.Core} id={trekker} />
      </td>
      <td className="px-1 py-2 border-slate-600">
        <ListContainer potentials={grouped.Medium} id={trekker} />
      </td>
      <td className="px-1 py-2 border-slate-600">
        <ListContainer potentials={grouped.Optional} id={trekker} />
      </td>
    </tr>
  )
}

export const Preview = () => {
  const previewRef = useRef<HTMLElement>(null)
  const [isPending, startTransition] = useTransition()

  const handleDownload = () => {
    startTransition(async () => {
      await downloadImage(previewRef.current)
    })
  }
  return (
    <>
      <Button
        onClick={handleDownload}
        className="fixed bottom-1 left-1 z-2"
        disabled={isPending}
      >
        {isPending ? 'Converting...' : 'Export'}
      </Button>
      <div className="h-0 overflow-hidden">
        <section ref={previewRef} className="w-4xl rounded" id="preview">
          <table className="w-full bg-slate-800 shadow-lg rounded-lg table-auto border-collapse">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-2 py-2 text-center font-semibold">Trekker</th>
                <th className="px-2 py-2 text-center font-semibold">Core</th>
                <th className="px-2 py-2 text-center font-semibold">Medium</th>
                <th className="px-2 py-2 text-center font-semibold">
                  Optional
                </th>
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
    </>
  )
}
