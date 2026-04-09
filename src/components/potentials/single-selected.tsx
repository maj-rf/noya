import { X } from 'lucide-react'
import { useSortable } from '@dnd-kit/react/sortable'
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

type SingleSelectedProps = {
  slot: Slot
  id: number
  idx: number
  rarity: 1 | 2 | 0
}

export function SingleSelected({
  slot,
  id,
  idx,
  rarity,
  children,
}: PropsWithChildren<SingleSelectedProps>) {
  const s = usePotentialStore((state) =>
    state.potentials[slot].find((sel) => sel.id === id),
  )
  const updateLevel = usePotentialStore((sel) => sel.updateLevel)
  const removePotential = usePotentialStore((sel) => sel.removePotential)
  const updatePriority = usePotentialStore((sel) => sel.updatePriority)
  const { ref, isDragging } = useSortable({
    id,
    index: idx,
    disabled: rarity === 0,
  })
  if (!s) return
  return (
    <div
      ref={ref}
      className={`flex flex-col gap-2 justify-center ${isDragging && 'rotate-6'}`}
    >
      <div className="relative">
        {children}
        {s.rarity !== 0 && (
          <div
            className={cn(
              'absolute -top-[1.5px] left-3 text-xs font-semibold tracking-tighter text-slate-600 pointer-events-none',
              {
                'left-2': String(s.level).length >= 2,
              },
            )}
          >
            {s.level}
          </div>
        )}
        <div className="absolute -top-1 -right-1">
          <Button
            variant="destructive"
            size="icon-xs"
            aria-label="delete-card"
            className="rounded-full bg-destructive/90 dark:bg-destructive hover:bg-destructive/80 dark:hover:bg-destructive/90 text-white"
            onClick={() => removePotential(slot, s.id)}
          >
            <X />
          </Button>
        </div>
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
            <SelectItem className="text-[10px]" value="Low">
              Low
            </SelectItem>
            <SelectItem className="text-[10px]" value="Optional">
              Optional
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
