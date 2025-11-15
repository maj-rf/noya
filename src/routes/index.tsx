import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { SSCharacter, Trekkers } from '@/types'
import { ResponsiveModal } from '@/components/responsive-modal'
import { SSPotentials } from '@/components/ss-potentials'
import { AvatarSelection } from '@/components/avatar-selection'

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
    <main className="p-1">
      <div className="flex gap-2 justify-around max-w-md mx-auto mt-8">
        {Object.entries(trekkers).map(([key, value]) => (
          <ResponsiveModal
            key={key}
            title="Released Trekkers"
            triggerTitle={
              value ? value : key.charAt(0).toUpperCase() + key.slice(1)
            }
            desc={`Add the ${key.charAt(0).toUpperCase() + key.slice(1)} Trekker to your team`}
          >
            <AvatarSelection
              k={key}
              trekkers={trekkers}
              updateTrekkers={updateTrekkers}
            />
          </ResponsiveModal>
        ))}
      </div>
      <SSPotentials potentials={trekkers.main?.potential} type={'main'} />
      <SSPotentials potentials={trekkers.sub1?.potential} type={'support'} />
      <SSPotentials potentials={trekkers.sub2?.potential} type={'support'} />
    </main>
  )
}
