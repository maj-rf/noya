import ResponsiveIcon from './responsive-potential'
import type { SSPotential } from '@/types'

export const SSPotentials = ({
  potentials,
  type,
}: {
  potentials: Array<SSPotential>
  type: 'main' | 'support'
}) => {
  const filteredPotentials = potentials
    .filter((p) => p.type === type || p.type === 'common')
    .sort((a, b) => a.rarity - b.rarity)
  return (
    <div className="flex gap-1 flex-wrap mt-4 max-w-2xl w-full mx-auto justify-center">
      {filteredPotentials.map((p) => (
        <ResponsiveIcon
          key={p.imgId + p.id}
          size="md:w-30 w-25"
          bgSrc={`./ss-vestige/vestige_${p.rarity}.png`}
          iconSrc={`https://res.cloudinary.com/dafqr01it/image/upload/v1763084273/ss/potential/${p.imgId}_A.png`}
          name={p.name}
        />
      ))}
    </div>
  )
}
