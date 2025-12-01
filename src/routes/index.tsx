import { createFileRoute } from '@tanstack/react-router'
import { useRef, useTransition } from 'react'
import type { SSCharacter, Slot } from '@/types'
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
import { Loading } from '@/components/loading'
import { useTrekkerStore } from '@/lib/trekker-store'

export const Route = createFileRoute('/')({
  component: App,
  loader: fetchCharacters,
  pendingComponent: Loading,
})

function App() {
  const previewRef = useRef<HTMLElement>(null)
  const setTrekker = useTrekkerStore((s) => s.setTrekker)
  const clearPotentials = useTrekkerStore((s) => s.clearPotentials)
  const [isPending, startTransition] = useTransition()
  const trekkers = useTrekkerStore((s) => s.trekkers)

  const updateTrekkers = (slot: Slot, char: SSCharacter) => {
    const alreadyExists = Object.values(trekkers).some((t) => t?.id === char.id)
    const isSameSlot = trekkers[slot]?.id === char.id
    if (isSameSlot) {
      setTrekker(slot, null)
      clearPotentials(slot)
    } else if (alreadyExists) {
      return
    } else {
      setTrekker(slot, char)
      clearPotentials(slot)
    }
  }

  const handleDownload = () => {
    startTransition(async () => {
      await downloadImage(previewRef.current)
    })
  }

  return (
    <div className="relative pb-8">
      <Button
        onClick={handleDownload}
        className="fixed bottom-1 left-1 z-2"
        disabled={isPending}
      >
        {isPending ? 'Converting...' : 'Export'}
      </Button>
      <div className="flex gap-2 justify-center max-w-md mx-auto my-8">
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
                slot={key as Slot}
                trekkers={trekkers}
                updateTrekkers={updateTrekkers}
              />
            </ResponsiveModal>
          )
        })}
      </div>
      <SSPotentials slot="main" type="main" />
      <SSPotentials slot="sub1" type="support" />
      <SSPotentials slot="sub2" type="support" />
      <Preview
        avatar={getTrekkersWithoutPotentials(trekkers)}
        ref={previewRef}
      />
    </div>
  )
}
