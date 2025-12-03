import { createFileRoute } from '@tanstack/react-router'
import { useRef, useTransition } from 'react'
import { ResponsiveModal } from '@/components/responsive-modal'
import SSPotentials from '@/components/ss-potentials'
import { AvatarSelection } from '@/components/avatar-selection'
import { downloadImage, fetchCharacters } from '@/lib/utils'
import { Preview } from '@/components/preview'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/loading'
import { SSAvatar } from '@/components/ss-avatar'
import { useTrekkerStore } from '@/lib/trekker-store'

function AvatarPlaceholder() {
  const trekkers = useTrekkerStore((s) => s.trekkers)
  return (
    <div className="flex gap-2 justify-center max-w-md mx-auto">
      <div className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
        {trekkers.main ? <SSAvatar id={trekkers.main.id} /> : 'Main'}
      </div>
      <div className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
        {trekkers.sub1 ? <SSAvatar id={trekkers.sub1.id} /> : 'Support'}
      </div>
      <div className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
        {trekkers.sub2 ? <SSAvatar id={trekkers.sub2.id} /> : 'Support'}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: App,
  loader: fetchCharacters,
  pendingComponent: Loading,
})

function App() {
  const previewRef = useRef<HTMLElement>(null)
  const [isPending, startTransition] = useTransition()

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
      <section className="flex flex-col justify-center items-center gap-4 my-4">
        <AvatarPlaceholder />
        <ResponsiveModal
          title="Released Trekkers"
          triggerTitle={'Update Trekkers'}
          desc={`Add the Trekkers to your team`}
        >
          <AvatarSelection />
        </ResponsiveModal>
      </section>

      <SSPotentials slot="main" type="main" />
      <SSPotentials slot="sub1" type="support" />
      <SSPotentials slot="sub2" type="support" />
      <Preview ref={previewRef} />
    </div>
  )
}
