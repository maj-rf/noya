import characters from '../character.json'
import type { SSCharacter, Trekkers } from '@/types'
import { SSAvatar } from '@/components/ss-avatar'

export const AvatarSelection = ({
  k,
  trekkers,
  updateTrekkers,
}: {
  k: string
  trekkers: Trekkers
  updateTrekkers: (key: string, char: SSCharacter) => void
}) => {
  return (
    <section className="flex flex-wrap justify-center gap-2 mt-2">
      {Object.entries(characters).map(([id, char]) => {
        const { potential, ...avatar } = char
        return (
          <div
            key={id}
            onClick={() => updateTrekkers(k, char as SSCharacter)}
            data-disabled={Object.values(trekkers).some(
              (t) => t?.id === char.id,
            )}
            data-selected={trekkers[k as keyof Trekkers]?.id === char.id}
            className="group outline-blue-600 rounded-xs data-[selected=true]:outline-2 h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8]"
          >
            <SSAvatar char={avatar} />
          </div>
        )
      })}
    </section>
  )
}
