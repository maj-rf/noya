import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from '@tanstack/react-router'
import { useTransition } from 'react'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { BuildMap } from '@/types'
import { ResponsiveModal } from '@/components/responsive-modal'
import SSPotentials from '@/components/potentials/ss-potentials'
import { TrekkerSelection } from '@/components/trekkers/trekker-selection'
import { Preview } from '@/components/preview'
import { Loading } from '@/components/loading'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { cn, saveToLocal } from '@/lib/utils'
import { TrekkerPlaceholder } from '@/components/trekkers/trekker-placeholder'

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
  pendingComponent: () => (
    <div className="h-screen">
      <Loading />
    </div>
  ),
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
  const [isPending, startTransition] = useTransition()
  const { id, name } = Route.useLoaderData()
  return (
    <div className="relative pb-8">
      <section className="w-full my-4 flex flex-col sm:flex-row justify-center items-center gap-4">
        <TrekkerPlaceholder />
        <div className="flex flex-col gap-2">
          <ResponsiveModal
            title="Released Trekkers"
            triggerTitle={'Choose Trekkers'}
            desc={`Add the Trekkers to your team`}
          >
            <TrekkerSelection />
          </ResponsiveModal>
          <Button asChild variant="secondary">
            <Link to="/">Create Build</Link>
          </Button>
        </div>
      </section>

      <div className="w-full max-w-md flex justify-center items-center gap-2 mx-auto mb-4">
        <span className="text-muted-foreground truncate">{name} Build</span>
        <Button
          onClick={() => {
            startTransition(async () => {
              try {
                saveToLocal(id, name)
                await router.invalidate()
                toast.success(`${name} build updated`)
              } catch (error) {
                toast.error('Cannot properly save build')
              }
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
      <SSPotentials slot="main" type="main" />
      <SSPotentials slot="sub1" type="support" />
      <SSPotentials slot="sub2" type="support" />
      <Preview />
    </div>
  )
}
