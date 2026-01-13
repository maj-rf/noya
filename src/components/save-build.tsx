import { useRef, useTransition } from 'react'
import { useRouter } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { LoadBuild } from './load-build'
import type { BuildMap } from '@/types'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'

function saveToLocal(id: string, name: string) {
  const potentials = usePotentialStore.getState().potentials
  const trekkers = useTrekkerStore.getState().trekkers
  const buildsJSON = localStorage.getItem('saved-builds')
  const builds: BuildMap = buildsJSON ? JSON.parse(buildsJSON) : {}
  builds[id] = { id, trekkers, potentials, name }
  localStorage.setItem('saved-builds', JSON.stringify(builds))
}

export const SaveBuild = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSave = () => {
    if (!buildNameRef.current?.value) return
    startTransition(async () => {
      if (buildNameRef.current) {
        saveToLocal(crypto.randomUUID(), buildNameRef.current.value)
        buildNameRef.current.value = ''
        await router.invalidate()
      }
    })
  }
  const buildNameRef = useRef<HTMLInputElement>(null)
  return (
    <section className="w-full max-w-11/12 mx-auto mb-2">
      <div className="w-full sm:max-w-md flex flex-col sm:flex-row gap-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Amber OHKO Build..."
            ref={buildNameRef}
            disabled={isPending}
          />
          <InputGroupAddon></InputGroupAddon>

          {isPending && (
            <InputGroupAddon align="inline-end">
              <LoaderCircle className="animate-spin" />
            </InputGroupAddon>
          )}
        </InputGroup>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isPending}>
            Save
          </Button>
          <LoadBuild />
        </div>
      </div>
    </section>
  )
}
