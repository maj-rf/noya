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

  const sortedPotentials = potentials.sort((a, b) => {
    const order = ['Core', 'Medium', 'Optional'] as const
    return order.indexOf(a.priority) - order.indexOf(b.priority)
  })

  return (
    <article>
      <div className="bg-blue-900">
        <h1 className="px-4 text-left text-white">
          {slot === 'main' ? 'Main' : 'Support'}
        </h1>
      </div>
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="h-[125px] w-[100px]">
          {avatar && <SSAvatar char={avatar} />}
        </div>
        <ul className="gap-2 flex-1 flex w-full flex-wrap">
          {potentials.length === 0 ? (
            <li className="text-center text-white">No Chosen potential</li>
          ) : (
            sortedPotentials.map((p) => {
              return (
                <li key={'preview' + p.id} className="relative inline-block">
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
              )
            })
          )}
        </ul>
      </div>
    </article>
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
      <section ref={ref} className="bg-slate-600 w-2xl" id="preview">
        <PreviewRow avatar={avatar.main} slot="main" />
        <PreviewRow avatar={avatar.sub1} slot="sub1" />
        <PreviewRow avatar={avatar.sub2} slot="sub2" />
      </section>
    </div>
  )
}
