import { getRouteApi, useRouter } from '@tanstack/react-router'
import { Check, LoaderCircle, Trash } from 'lucide-react'
import { useTransition } from 'react'
import { ResponsiveModal } from './responsive-modal'
import { SSAvatar } from './ss-avatar'
import { Button } from './ui/button'
import type { BuildMap } from '@/types'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'

function deleteBuild(id: string) {
  const buildsJSON = localStorage.getItem('saved-builds')
  const builds: BuildMap = buildsJSON ? JSON.parse(buildsJSON) : {}

  delete builds[id]
  localStorage.setItem('saved-builds', JSON.stringify(builds))
}

export function LoadBuild() {
  const router = useRouter()
  const routeApi = getRouteApi('/')
  const { savedBuilds } = routeApi.useLoaderData()
  const [isPending, startTransition] = useTransition()

  const setBuilds = (id: string) => {
    const build = savedBuilds[id]
    useTrekkerStore.setState({ trekkers: build.trekkers })
    usePotentialStore.setState({ potentials: build.potentials })
  }

  return (
    <div>
      <ResponsiveModal
        triggerTitle="Load Build"
        title="Your saved builds!"
        desc="Builds are saved on your browser's local storage"
      >
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {Object.values(savedBuilds).map((b) => (
            <div
              className="w-[100px] md:w-[120px] flex flex-col gap-2"
              key={b.id}
            >
              <div className="h-[125px] w-full md:h-[150px] md:w-[120px] aspect-[0.8]">
                <SSAvatar id={b.trekkers.main as number} />
              </div>
              <p className="overflow-hidden text-ellipsis">{b.name}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setBuilds(b.id)}>
                  <Check />
                </Button>
                <Button
                  onClick={() => {
                    startTransition(async () => {
                      deleteBuild(b.id)
                      await router.invalidate()
                    })
                  }}
                  variant="destructive"
                  disabled={isPending}
                >
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Trash />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ResponsiveModal>
    </div>
  )
}
