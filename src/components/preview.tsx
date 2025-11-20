import clsx from 'clsx'
import { SSAvatar } from './ss-avatar'
import ResponsivePotential from './responsive-potential'
import type { SelectedPotential, TAvatar, TrekkerPotentials } from '@/types'
import type { RefObject } from 'react'

const PreviewRow = ({
  avatar,
  potentials,
  className,
}: {
  avatar: TAvatar | null
  potentials: Array<SelectedPotential> | null
  className?: string
}) => {
  return (
    <article
      className={clsx('flex justify-center p-4 gap-2 w-full', className)}
    >
      <div className="h-38 shrink-0">
        {avatar && <SSAvatar char={avatar} />}
      </div>
      <ul className="flex flex-wrap gap-2 flex-1">
        {!potentials ? (
          <div>No Chosen potential</div>
        ) : (
          potentials.map((p) => {
            return (
              <li key={'preview' + p.id} className="relative">
                <ResponsivePotential
                  size="w-30"
                  bgSrc={`./ss-vestige/vestige_${p.rarity}.png`}
                  iconSrc={`https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/${p.imgId}_A.png`}
                  name={p.name}
                />
                {p.rarity !== 0 && (
                  <div className="absolute top-0 left-4 text-sm font-semibold text-indigo-500">
                    {p.level}
                  </div>
                )}
              </li>
            )
          })
        )}
      </ul>
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
    <section ref={ref}>
      <PreviewRow
        avatar={avatar.main}
        potentials={potentials.main}
        className="bg-blue-500"
      />
      <PreviewRow
        avatar={avatar.sub1}
        potentials={potentials.sub1}
        className="bg-blue-300"
      />
      <PreviewRow
        avatar={avatar.sub2}
        potentials={potentials.sub2}
        className="bg-blue-100"
      />
    </section>
  )
}
