import { Link, getRouteApi, useRouter } from '@tanstack/react-router'
import { Check, LoaderCircle, Trash } from 'lucide-react'
import { useTransition } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { ResponsiveModal } from './responsive-modal'
import { Button } from './ui/button'
import { BaseTrekker } from './trekkers/base-trekker'
import { deleteBuild } from '@/utils/saveAndDeleteBuilds'

export function LoadBuild() {
  const router = useRouter()
  const routeApi = getRouteApi('__root__')
  const { savedBuilds, characters } = routeApi.useLoaderData()
  const [isPending, startTransition] = useTransition()

  return (
    <ResponsiveModal
      triggerTitle="Load Build"
      title="Load or delete your saved builds!"
      desc="Builds are saved in your browser's local storage"
    >
      <ScrollArea className="h-[300px] px-4">
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {Object.values(savedBuilds).map((b) => {
            const char = characters[b.trekkers.main as number]
            return (
              <div
                className="w-[100px] md:w-[120px] relative flex flex-col gap-1"
                key={b.id}
              >
                <div className="h-[125px] w-full md:h-[150px] md:w-[120px] aspect-[0.8]">
                  <BaseTrekker char={char} />
                </div>
                <p className="truncate bg-muted rounded-2xl px-2 py-1 tracking-tighter text-center">
                  {b.name}
                </p>
                <div className="absolute top-0 left-0 flex flex-col gap-1">
                  <Button
                    asChild
                    size="icon-sm"
                    variant="secondary"
                    className="rounded-full"
                  >
                    <Link
                      to={'/$id'}
                      params={{ id: b.id }}
                      preload={false}
                      disabled={isPending}
                    >
                      <Check />
                    </Link>
                  </Button>
                  <Button
                    onClick={() => {
                      startTransition(async () => {
                        deleteBuild(b.id)
                        await router.invalidate()
                      })
                    }}
                    variant="destructive"
                    size="icon-sm"
                    disabled={isPending}
                    className="rounded-full"
                  >
                    {isPending ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <Trash />
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </ResponsiveModal>
  )
}
