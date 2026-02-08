import type { SSCharacter } from '@/types'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const BaseTrekker = ({
  char,
  children,
}: {
  char: SSCharacter
  children?: ReactNode
}) => {
  return (
    <div
      className={cn(
        'rounded-xs avatar-border relative -translate-y-0.5 w-full h-full',
        {
          'avatar-common-bg': char.star === 4,
          'avatar-rare-bg': char.star === 5,
        },
      )}
    >
      <img
        alt={char.name + ' portrait'}
        className="block w-full h-full object-cover"
        fetchPriority="high"
        src={`https://res.cloudinary.com/dafqr01it/image/upload/v1762945238/ss/avatar/head_${char.id}01_XL.png`}
      />
      <h1 className="px-1 pt-3 text-sm tracking-tight leading-3.5 absolute right-0 -bottom-px font-medium text-right text-blue-900  bg-linear-0 from-white w-full">
        {char.name}
      </h1>
      {children}
    </div>
  )
}
