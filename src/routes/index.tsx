import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useRef, useState } from 'react'
import type {
  SSCharacter,
  SelectedPotential,
  TrekkerPotentials,
  Trekkers,
} from '@/types'
import { ResponsiveModal } from '@/components/responsive-modal'
import SSPotentials from '@/components/ss-potentials'
import { AvatarSelection } from '@/components/avatar-selection'
import {
  downloadImage,
  fetchCharacters,
  getTrekkersWithoutPotentials,
} from '@/lib/utils'
import { Preview } from '@/components/preview'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: App,
  loader: fetchCharacters,
  pendingComponent: () => <div>Loading...</div>,
})

function App() {
  const character = Route.useLoaderData()
  const previewRef = useRef<HTMLElement>(null)
  const [trekkers, setTrekkers] = useState<Trekkers>({
    main: character[103],
    sub1: character[112],
    sub2: character[111],
  })

  const [selectedPotentials, setSelectedPotentials] =
    useState<TrekkerPotentials>({
      main: null,
      sub1: null,
      sub2: null,
    })

  const updateTrekkers = (key: string, char: SSCharacter) => {
    const newObj = { ...trekkers }
    const potentialCopy = { ...selectedPotentials }
    const alreadyExists = Object.values(newObj).some((t) => t?.id === char.id)
    const removable = newObj[key as keyof Trekkers]?.id === char.id
    if (removable) {
      newObj[key as keyof Trekkers] = null
      potentialCopy[key as keyof TrekkerPotentials] = null
    } else if (alreadyExists) {
      return
    } else {
      newObj[key as keyof Trekkers] = char
    }
    setTrekkers(newObj)
    setSelectedPotentials(potentialCopy)
  }

  const setSelected = useCallback(
    (k: string, potentials: Array<SelectedPotential>) => {
      setSelectedPotentials((prev) => ({
        ...prev,
        [k as keyof TrekkerPotentials]: potentials,
      }))
    },
    [],
  )

  return (
    <main>
      <Button onClick={async () => downloadImage(previewRef.current)}>
        Export as Image
      </Button>
      <div className="flex gap-2 justify-around max-w-md mx-auto my-8">
        {Object.entries(trekkers).map(([key, value]) => {
          const label = key === 'main' ? 'Main' : 'Support'
          return (
            <ResponsiveModal
              key={key}
              title="Released Trekkers"
              triggerTitle={value ? value : label}
              desc={`Add the ${label} Trekker to your team`}
            >
              <AvatarSelection
                k={key}
                trekkers={trekkers}
                updateTrekkers={updateTrekkers}
              />
            </ResponsiveModal>
          )
        })}
      </div>
      <SSPotentials
        potentials={trekkers.main?.potential}
        type={'main'}
        selected={selectedPotentials.main}
        setSelected={setSelected}
        k="main"
      />
      <SSPotentials
        potentials={trekkers.sub1?.potential}
        type={'support'}
        selected={selectedPotentials.sub1}
        setSelected={setSelected}
        k="sub1"
      />
      <SSPotentials
        potentials={trekkers.sub2?.potential}
        type={'support'}
        selected={selectedPotentials.sub2}
        setSelected={setSelected}
        k="sub2"
      />

      <Preview
        avatar={getTrekkersWithoutPotentials(trekkers)}
        potentials={selectedPotentials}
        ref={previewRef}
      />
    </main>
  )
}
