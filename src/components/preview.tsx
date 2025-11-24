import { SSAvatar } from './ss-avatar'
import ResponsivePotential from './responsive-potential'
import type { SelectedPotential, TAvatar, TrekkerPotentials } from '@/types'
import type { RefObject } from 'react'

const PreviewRow = ({
  avatar,
  potentials,
  k,
}: {
  avatar: TAvatar | null
  potentials: Array<SelectedPotential> | null
  k: 'Main' | 'Support'
}) => {
  return (
    <article>
      <div className="bg-blue-900">
        <h1 className="px-4 text-left text-white">{k}</h1>
      </div>
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="h-[125px] w-[100px]">
          {avatar && <SSAvatar char={avatar} />}
        </div>
        <ul className="gap-2 flex-1">
          {!potentials || potentials.length === 0 ? (
            <div className="text-center text-white">No Chosen potential</div>
          ) : (
            potentials.map((p) => {
              return (
                <li key={'preview' + p.id} className="relative inline-block">
                  <ResponsivePotential
                    bgSrc={`./ss-vestige/vestige_${p.rarity}.png`}
                    iconSrc={`https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/${p.imgId}_A.png`}
                    name={p.name}
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
  potentials,
  ref,
}: {
  avatar: Record<'main' | 'sub1' | 'sub2', TAvatar | null>
  potentials: TrekkerPotentials
  ref: RefObject<HTMLElement | null>
}) => {
  return (
    <div className="h-0 overflow-hidden">
      <section ref={ref} className="bg-slate-600 w-4xl" id="preview">
        <PreviewRow
          avatar={avatar.main}
          potentials={potentials.main}
          k="Main"
        />
        <PreviewRow
          avatar={avatar.sub1}
          potentials={potentials.sub1}
          k="Support"
        />
        <PreviewRow
          avatar={avatar.sub2}
          potentials={potentials.sub2}
          k="Support"
        />
      </section>
    </div>
  )
}
