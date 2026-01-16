import { getRouteApi } from '@tanstack/react-router'
import { BaseTrekker } from './base-trekker'
import { cn } from '@/lib/utils'

export const SSTrekker = ({ id }: { id: number }) => {
  const routeApi = getRouteApi('__root__')
  const { characters } = routeApi.useLoaderData()
  const char = characters[id]
  return (
    <div className="group-data-[disabled=true]:opacity-40 bg-gray-400 border-none padding-0 rounded-sm w-full h-full">
      <BaseTrekker char={char}>
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
      </BaseTrekker>
    </div>
  )
}
