import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import characters from '../character.json'
import type { SSCharacter, Trekkers } from '@/types'
import { SSAvatar } from '@/components/ss-avatar'
import { ResponsiveModal } from '@/components/responsive-modal'
import { SSPotentials } from '@/components/ss-potentials'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [trekkers, setTrekkers] = useState<Trekkers>({
    main: null,
    sub1: null,
    sub2: null,
  })

  const updateTrekkers = (key: string, char: SSCharacter) => {
    const newObj = { ...trekkers }
    const alreadyExists = Object.values(newObj).some((t) => t?.id === char.id)
    const removable = newObj[key as keyof Trekkers]?.id === char.id
    if (removable) {
      newObj[key as keyof Trekkers] = null
    } else if (alreadyExists) {
      return
    } else {
      newObj[key as keyof Trekkers] = char
    }
    setTrekkers(newObj)
  }

  return (
    <div className="p-1">
      <div className="grid grid-cols-3 max-w-lg w-full mx-auto gap-2 mt-8">
        {Object.entries(trekkers).map(([key, value]) => (
          <ResponsiveModal
            key={key}
            title="Released Trekkers"
            triggerTitle={
              value ? value : key.charAt(0).toUpperCase() + key.slice(1)
            }
            desc={`Add the ${key.charAt(0).toUpperCase() + key.slice(1)} Trekker to your team`}
          >
            <div className="grid grid-cols-4 md:grid-cols-5 w-full gap-1.5 mt-2">
              {Object.entries(characters).map(([id, char]) => {
                const { potential, ...avatar } = char
                return (
                  <div
                    key={id}
                    onClick={() => updateTrekkers(key, char as SSCharacter)}
                    data-disabled={Object.values(trekkers).some(
                      (t) => t?.id === char.id,
                    )}
                    className="data-[disabled=true]:opacity-40"
                  >
                    <SSAvatar char={avatar} />
                  </div>
                )
              })}
            </div>
          </ResponsiveModal>
        ))}
      </div>

      {trekkers.main?.potential && (
        <SSPotentials potentials={trekkers.main.potential} type={'main'} />
      )}
      {trekkers.sub1?.potential && (
        <SSPotentials potentials={trekkers.sub1.potential} type={'support'} />
      )}
      {trekkers.sub2?.potential && (
        <SSPotentials potentials={trekkers.sub2.potential} type={'support'} />
      )}
    </div>
  )
}
