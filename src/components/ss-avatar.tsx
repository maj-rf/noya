import type { TAvatar } from '@/types'
import { cn } from '@/lib/utils'

// TODO: rethink image sizing

export const SSAvatar = ({ char }: { char: TAvatar }) => {
  return (
    <div className="bg-gray-400 border-none padding-0 outline-offset-4 rounded-sm">
      <div
        className={cn(
          'rare-border rounded-xs avatar-border relative -translate-y-0.5',
          {
            'avatar-common-bg': char.star === 4,
            'avatar-rare-bg': char.star === 5,
          },
        )}
      >
        <img
          className="block h-[150px] w-full object-contain object-top"
          src={`https://res.cloudinary.com/dafqr01it/image/upload/v1762945238/ss/avatar/head_${char.id}01_XL.png`}
        />
        <img
          className="size-6 absolute -top-0.5 left-0"
          src={`./ss-element/${char.element}.webp`}
        />
        <div
          className={cn(
            'absolute top-0 right-0 fluid-sm text-white pl-2 left-slant flex items-center justify-center gap-0.5',
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
              className="block object-contain"
              src={`./ss-class/${char.attackType}.png`}
            />
          </div>
        </div>

        <h1 className="px-1 pt-4 absolute right-0 bottom-0 fluid-base font-medium text-right text-blue-900  bg-linear-0 from-white w-full">
          {char.name}
        </h1>
      </div>
    </div>
  )
}
