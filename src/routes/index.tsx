import { createFileRoute } from '@tanstack/react-router'
import characters from '../character.json'
import type { SSCharacter } from '@/types'
import { SSAvatar } from '@/components/ss-avatar'

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
          <SSAvatar key={id} char={char as SSCharacter} />
        ))}
      </div>
    </div>
  )
}
