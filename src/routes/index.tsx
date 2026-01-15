import { createFileRoute } from '@tanstack/react-router'
import { ResponsiveModal } from '@/components/responsive-modal'
import SSPotentials from '@/components/potentials/ss-potentials'
import { TrekkerSelection } from '@/components/trekkers/trekker-selection'
import { Preview } from '@/components/preview'
import { Loading } from '@/components/loading'
import { SSTrekker } from '@/components/trekkers/ss-trekker'
import { useTrekkerStore } from '@/lib/store'
import { Presets } from '@/components/presets'
import { SaveBuild } from '@/components/save-build'
import { LoadBuild } from '@/components/load-build'

export const Route = createFileRoute('/')({
  component: App,
  loader: () => {
    // for HMR
    if (
      Object.values(useTrekkerStore.getState().trekkers).some((a) => a !== null)
    ) {
      return
    }
    useTrekkerStore.setState({
      trekkers: {
        main: 103,
        sub1: 112,
        sub2: 111,
      },
    })
  },
  pendingComponent: Loading,
})

function App() {
  const trekkers = useTrekkerStore((s) => s.trekkers)
  return (
    <div className="relative pb-8">
      <section className="w-full my-4 flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="flex gap-2">
          <div className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
            {trekkers.main ? (
              <SSTrekker id={trekkers.main} />
            ) : (
              <span className="text-red-400">Main</span>
            )}
          </div>
          <div className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
            {trekkers.sub1 ? (
              <SSTrekker id={trekkers.sub1} />
            ) : (
              <span className="text-blue-500">Support</span>
            )}
          </div>
          <div className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
            {trekkers.sub2 ? (
              <SSTrekker id={trekkers.sub2} />
            ) : (
              <span className="text-blue-500">Support</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <ResponsiveModal
            title="Released Trekkers"
            triggerTitle={'Choose Trekkers'}
            desc={`Add the Trekkers to your team`}
          >
            <TrekkerSelection />
          </ResponsiveModal>
          <div className="flex flex-row sm:flex-col gap-2">
            <LoadBuild />
            <Presets />
          </div>
        </div>
      </section>
      <SaveBuild />
      <SSPotentials slot="main" type="main" />
      <SSPotentials slot="sub1" type="support" />
      <SSPotentials slot="sub2" type="support" />
      <Preview />
    </div>
  )
}
