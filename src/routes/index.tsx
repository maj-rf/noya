import { createFileRoute } from '@tanstack/react-router'
import characters from '../character.json'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 max-w-md mx-auto gap-2 mb-4">
        {[0, 1, 2].map((n) => (
          <div key={n} className="h-[150px] w-full border"></div>
        ))}
      </div>
      <div className="grid grid-cols-5 max-w-xl mx-auto gap-2">
        {Object.entries(characters).map(([id, char]) => (
          <div
            key={id}
            className={cn('rare-border rounded-sm avatar-border relative', {
              'avatar-common-bg': char.star === 4,
              'avatar-rare-bg': char.star === 5,
            })}
          >
            <img
              className="block h-auto w-full"
              src={`https://res.cloudinary.com/dafqr01it/image/upload/v1762945238/ss/avatar/head_${id}01_XL.png`}
            />
            <div className="absolute -top-1 -left-1 w-full flex items-center justify-between">
              <img
                className="h-6 w-6"
                src={`./ss-element/${char.element}.webp`}
              />
              <p
                className={cn('text-xs text-white pl-2 left-slant', {
                  'bg-pink-500': char.class === 'Vanguard',
                  'bg-teal-400': char.class === 'Support',
                  'bg-indigo-400': char.class === 'Versatile',
                })}
              >
                {char.class}
              </p>
            </div>
            <h1 className="absolute text-sm text-right text-blue-900 pt-2 font-medium right-0 bottom-0 text-md bg-linear-0 from-white w-full">
              {char.name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}
