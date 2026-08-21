import { createFileRoute } from '@tanstack/react-router'
import { ResponsiveModal } from '@/components/responsive-modal'
import { TrekkerSelection } from '@/components/trekkers/trekker-selection'
import { Preview } from '@/components/preview'
import { Loading } from '@/components/loading'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'
import { TrekkerGrid } from '@/components/trekkers/trekker-grid'
import { getSelectedPots } from '@/utils/getSelectedPots'

export const Route = createFileRoute('/')({
  component: App,
  loader: async ({ context }) => {
    // for HMR
    if (
      Object.values(useTrekkerStore.getState().trekkers).some((a) => a !== null)
    ) {
      return
    }
    const { potentials } = await context.fetchData()
    useTrekkerStore.setState({
      trekkers: {
        main: 103,
        sub1: 112,
        sub2: 111,
      },
    })
    usePotentialStore.setState({
      potentials: {
        main: getSelectedPots(potentials[103], 'main'),
        sub1: getSelectedPots(potentials[112], 'support'),
        sub2: getSelectedPots(potentials[111], 'support'),
      },
    })
  },
  pendingComponent: Loading,
})

function App() {
  return (
    <div className="relative pb-8">
      <div className="flex flex-row sm:flex-col gap-2">
        <ResponsiveModal
          title="Released Trekkers"
          triggerTitle={'Choose Trekkers'}
          desc={`Add the Trekkers to your team`}
        >
          <TrekkerSelection />
        </ResponsiveModal>
      </div>
      <div className="flex flex-wrap gap-4 w-full justify-center">
        <TrekkerGrid slot="main" type="main" />
        <TrekkerGrid slot="sub1" type="support" />
        <TrekkerGrid slot="sub2" type="support" />
      </div>

      <Preview />
    </div>
  )
}
