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
    <section className="flex flex-wrap justify-center gap-1 mt-2">
      {Object.entries(characters).map(([id, char]) => {
        const { potential, ...avatar } = char
        return (
          <div
            key={id}
            onClick={() => updateTrekkers(k, char as SSCharacter)}
            data-disabled={Object.values(trekkers).some(
              (t) => t?.id === char.id,
            )}
            className="data-[disabled=true]:opacity-40"
          >
            <SSAvatar char={avatar} />
          </div>
        )
      })}
    </section>
  )
}
