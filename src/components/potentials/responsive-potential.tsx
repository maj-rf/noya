import type { SSPotential } from '@/types'

type Props = Pick<SSPotential, 'id'> & {
  size?: string
  className?: string
}

export default function ResponsivePotential({
  size = 'w-20',
  className = '',
  id,
}: Props) {
  const iconSrc = `https://res.cloudinary.com/dafqr01it/image/upload/v1787302355/ss/pots/${id}.png`

  return (
    <div
      className={`relative ${size} h-fit aspect-[0.7851] bg-contain bg-center bg-no-repeat ${className} rounded-xs`}
    >
      <img
        src={iconSrc}
        alt={id + 'pots'}
        className="absolute inset-0 w-full h-full object-cover rounded-xs pointer-events-none"
      />
    </div>
  )
}
