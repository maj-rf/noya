import { useMemo, useRef, useTransition } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { SSTrekker } from './trekkers/ss-trekker'
import ResponsivePotential from './potentials/responsive-potential'
import { Button } from './ui/button'
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
  const routeApi = getRouteApi('/')
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
                  'absolute top-0 left-3 text-xs font-semibold tracking-tighter text-indigo-500',
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

  return (
    <tr>
      <td className="px-2 py-4 border-b border-slate-600 space-y-2">
        <div className="h-[125px] w-[100px]">
          <SSTrekker id={trekker} />
        </div>
        <p
          className={cn(
            'text-center text-white rounded-sm font-medium bg-blue-900',
            {
              'bg-red-900': slot === 'main',
            },
          )}
        >
          {slot === 'main' ? 'Main' : 'Support'}
        </p>
      </td>
      <td className="px-1 py-2 border-b border-slate-600">
        <ListContainer potentials={grouped.Core} id={trekker} />
      </td>
      <td className="px-1 py-2 border-b border-slate-600">
        <ListContainer potentials={grouped.Medium} id={trekker} />
      </td>
      <td className="px-1 py-2 border-b border-slate-600">
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
