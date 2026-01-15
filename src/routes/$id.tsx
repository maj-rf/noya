import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from '@tanstack/react-router'
import { useTransition } from 'react'
import { LoaderCircle } from 'lucide-react'
import type { BuildMap } from '@/types'
import { ResponsiveModal } from '@/components/responsive-modal'
import SSPotentials from '@/components/potentials/ss-potentials'
import { TrekkerSelection } from '@/components/trekkers/trekker-selection'
import { Preview } from '@/components/preview'
import { Loading } from '@/components/loading'
import { SSTrekker } from '@/components/trekkers/ss-trekker'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn, saveToLocal } from '@/lib/utils'

function assertBuild<T>(value: T | undefined): asserts value is T {
  if (!value) {
    throw notFound()
  }
}

export const Route = createFileRoute('/$id')({
  component: RouteComponent,
  loader: ({ params }) => {
    const buildsJSON = localStorage.getItem('saved-builds')
    const builds: BuildMap = buildsJSON ? JSON.parse(buildsJSON) : {}
    const build = builds[params.id]
    assertBuild(build)
    useTrekkerStore.setState({ trekkers: build.trekkers })
    usePotentialStore.setState({ potentials: build.potentials })
    return { id: build.id, name: build.name }
  },
  pendingComponent: Loading,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center h-full">
      <p>Build not found.</p>
      <Button asChild variant="link">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  ),
})

function RouteComponent() {
  const router = useRouter()
  const trekkers = useTrekkerStore((s) => s.trekkers)
  const [isPending, startTransition] = useTransition()
  const { id, name } = Route.useLoaderData()
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
        <div className="flex flex-col gap-3">
          <ResponsiveModal
            title="Released Trekkers"
            triggerTitle={'Choose Trekkers'}
            desc={`Add the Trekkers to your team`}
          >
            <TrekkerSelection />
          </ResponsiveModal>
          <Button asChild variant="secondary">
            <Link to={'/'}>Create New Build</Link>
          </Button>
        </div>
      </section>
      <div className="w-full max-w-11/12 mx-auto mb-4">
        <div className="w-full max-w-md flex justify-center items-center gap-2 mx-auto">
          <span className="text-muted-foreground">{name} Build</span>
          <Button
            onClick={() => {
              startTransition(async () => {
                saveToLocal(id, name)
                await router.invalidate()
              })
            }}
            disabled={isPending}
            className="grid place-items-center"
          >
            <span
              className={cn('col-1 row-1', isPending ? 'invisible' : 'visible')}
            >
              Save Changes
            </span>
            <span
              aria-label="Uploading..."
              className={cn('col-1 row-1', isPending ? 'visible' : 'invisible')}
            >
              <LoaderCircle className="animate-spin" />
            </span>
          </Button>
        </div>
      </div>
      <SSPotentials slot="main" type="main" />
      <SSPotentials slot="sub1" type="support" />
      <SSPotentials slot="sub2" type="support" />
      <Preview />
    </div>
  )
}
