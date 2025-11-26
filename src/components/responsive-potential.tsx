import type { SSPotential } from '@/types'
import { cn } from '@/lib/utils'

type Props = Pick<SSPotential, 'rarity' | 'name' | 'imgId' | 'subIcon'> & {
  size?: string // e.g. "w-32", "w-16", "w-full"
  className?: string
}

export default function ResponsivePotential({
  size = 'w-24',
  className = '',
  rarity,
  imgId,
  name,
  subIcon,
}: Props) {
  const bgSrc = `./ss-vestige/vestige_${rarity}.png`
  const iconSrc = `https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/${imgId}_A.png`
  const subIconUrl = `https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/Potential_${subIcon}_A.png`

  return (
    <div
      className={`relative ${size} h-fit aspect-[0.7851] bg-contain bg-center bg-no-repeat ${className} border rounded-sm`}
      style={{ backgroundImage: `url(${bgSrc})` }}
    >
      <img
        src={iconSrc}
        alt={name + ' icon'}
        className="absolute inset-0 -top-5 w-auto h-20 m-auto"
      />

      {subIcon && (
        <img
          src={subIconUrl}
          alt={name + ' subIcon'}
          className={cn(
            `absolute inset-0 -top-4 h-20 w-auto m-auto drop-shadow-sm`,
            {
              'drop-shadow-purple-800': rarity === 1,
              'drop-shadow-yellow-700': rarity === 2,
            },
          )}
        />
      )}

      <div className="absolute bottom-1 px-1 left-1/2 -translate-x-1/2 text-xxs drop-shadow-md w-full text-black text-center">
        {name}
      </div>
    </div>
  )
}
