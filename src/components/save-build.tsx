import { useRef, useTransition } from 'react'
import { useRouter } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { saveToLocal } from '@/lib/utils'
import { useTrekkerStore } from '@/lib/store'

export const SaveBuild = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const buildNameRef = useRef<HTMLInputElement>(null)
  const main = useTrekkerStore((s) => s.trekkers.main)

  const handleSave = () => {
    if (!buildNameRef.current?.value || !main) return
    startTransition(async () => {
      if (buildNameRef.current) {
        saveToLocal(crypto.randomUUID(), buildNameRef.current.value)
        buildNameRef.current.value = ''
        await router.invalidate()
      }
    })
  }

  return (
    <section className="w-full max-w-11/12 mx-auto mb-4">
      <div className="w-full max-w-md flex gap-2 mx-auto">
        <InputGroup>
          <InputGroupAddon>
            <label htmlFor="build-name">Build Name</label>
          </InputGroupAddon>
          <InputGroupInput
            ref={buildNameRef}
            disabled={isPending}
            id="build-name"
          />
          {isPending && (
            <InputGroupAddon align="inline-end">
              <LoaderCircle className="animate-spin" />
            </InputGroupAddon>
          )}
        </InputGroup>

        <Button onClick={handleSave} disabled={isPending}>
          Save
        </Button>
      </div>
    </section>
  )
}
