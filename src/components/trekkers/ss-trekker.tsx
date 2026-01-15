import { getRouteApi } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export const SSTrekker = ({ id }: { id: number }) => {
  const routeApi = getRouteApi('__root__')
  const { characters } = routeApi.useLoaderData()
  const char = characters[id]
  return (
    <div className="group-data-[disabled=true]:opacity-40 bg-gray-400 border-none padding-0 rounded-sm w-full h-full">
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
        <img
          alt={char.name + 'element'}
          className="size-6 absolute -top-1 -left-1 z-100"
          src={`./ss-element/${char.element}.webp`}
        />
        <div
          className={cn(
            'absolute top-0 right-0 text-xs text-white pl-1.5 left-slant flex items-center justify-center gap-0.5',
            {
              'bg-vanguard': char.class === 'Vanguard',
              'bg-support': char.class === 'Support',
              'bg-versatile': char.class === 'Versatile',
            },
          )}
        >
          <span>{char.class}</span>
          <div className="size-4 bg-blue-900 left-slant-l flex items-center justify-center pl-0.5">
            <img
              alt={char.name + 'attack type'}
              className="block size-2.5 object-contain"
              src={`./ss-class/${char.attackType}.png`}
            />
          </div>
        </div>

        <h1 className="px-1 pt-4 text-sm tracking-tight absolute right-0 bottom-0 font-medium text-right text-blue-900  bg-linear-0 from-white w-full">
          {char.name}
        </h1>
      </div>
    </div>
  )
}
