import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import type { PotentialPriority, Slot } from '@/types'
import type { PropsWithChildren } from 'react'
import { usePotentialStore } from '@/lib/store'
import { MAX_LEVEL, cn } from '@/lib/utils'

type SingleSelectedProps = { slot: Slot; id: number }

export function SingleSelected({
  slot,
  id,
  children,
}: PropsWithChildren<SingleSelectedProps>) {
  const s = usePotentialStore((state) =>
    state.potentials[slot].find((sel) => sel.id === id),
  )
  const updateLevel = usePotentialStore((sel) => sel.updateLevel)
  const removePotential = usePotentialStore((sel) => sel.removePotential)
  const updatePriority = usePotentialStore((sel) => sel.updatePriority)
  if (!s) return
  return (
    <div className="flex flex-col gap-2 justify-center">
      <div className="relative">
        {children}
        {s.rarity !== 0 && (
          <div
            className={cn(
              'absolute -top-px left-3 text-xs font-semibold tracking-tighter text-slate-600',
              {
                'left-2': String(s.level).length >= 2,
              },
            )}
          >
            {s.level}
          </div>
        )}
        <Button
          variant="destructive"
          size="icon"
          aria-label="delete-card"
          className="absolute -top-1 -right-1 rounded-full size-4 border border-white"
          onClick={() => removePotential(slot, s.id)}
        >
          <X className="size-3" />
        </Button>
      </div>

      <div className="w-20 space-y-1">
        <Select
          disabled={s.rarity === 0}
          value={s.level ? String(s.level) : undefined}
          onValueChange={(value) => updateLevel(slot, s.id, value)}
        >
          <SelectTrigger className="text-[10px] w-full px-2" size="sm">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem className="text-[10px]" value="1+">
              1+
            </SelectItem>
            {[...Array(MAX_LEVEL)].map((_, index) => (
              <SelectItem
                className="text-[10px]"
                key={'level ' + String(index + 1)}
                value={String(index + 1)}
              >
                {index + 1}
              </SelectItem>
            ))}
            <SelectItem className="text-[10px]" value={`${MAX_LEVEL}+`}>
              {`${MAX_LEVEL}+`}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select
          disabled={s.rarity === 0}
          value={s.priority}
          onValueChange={(value) =>
            updatePriority(slot, id, value as PotentialPriority)
          }
        >
          <SelectTrigger className="text-[10px] w-full px-2" size="sm">
            <SelectValue placeholder="PotentialPriority" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem className="text-[10px]" value="Core">
              Core
            </SelectItem>
            <SelectItem className="text-[10px]" value="Medium">
              Medium
            </SelectItem>
            <SelectItem className="text-[10px]" value="Optional">
              Optional
            </SelectItem>
            <SelectItem className="text-[10px]" value="Low">
              Low
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
