import type { SSCharacter } from '@/types'
import { cn } from '@/lib/utils'

export const SSAvatar = ({ char }: { char: SSCharacter }) => {
  return (
    <div className="bg-gray-400 border-none padding-0 outline-offset-4 rounded-sm transition-all hover:-translate-y-1">
      <div
        className={cn(
          'rare-border rounded-sm avatar-border relative -translate-y-0.5',
          {
            'avatar-common-bg': char.star === 4,
            'avatar-rare-bg': char.star === 5,
          },
        )}
      >
        <img
          className="block h-auto w-full"
          src={`https://res.cloudinary.com/dafqr01it/image/upload/v1762945238/ss/avatar/head_${char.id}01_XL.png`}
        />
        <div className="absolute -top-1 left-0 w-full flex items-center justify-between">
          <img className="size-6" src={`./ss-element/${char.element}.webp`} />
          <div
            className={cn(
              'text-xs text-white pl-2 left-slant flex items-center justify-center gap-0.5',
              {
                'bg-pink-500': char.class === 'Vanguard',
                'bg-teal-500': char.class === 'Support',
                'bg-indigo-400': char.class === 'Versatile',
              },
            )}
          >
            <span>{char.class}</span>
            <div className="size-4 bg-blue-900 left-slant-l p-[3px]">
              <img
                className="size-full block object-contain"
                src={`./ss-class/${char.attackType}.png`}
              />
            </div>
          </div>
        </div>
        <h1 className="absolute text-sm text-right text-blue-900 pt-2 font-medium right-0 bottom-0 text-md bg-linear-0 from-white w-full">
          {char.name}
        </h1>
      </div>
    </div>
  )
}
