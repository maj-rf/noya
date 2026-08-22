import { getRouteApi } from '@tanstack/react-router'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { move } from '@dnd-kit/helpers'
import { RiSubtractFill, RiThumbUpFill } from '@remixicon/react'
import ResponsivePotential from '../potentials/responsive-potential'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import { SSTrekker } from './ss-trekker'
import type { PotentialPriority, SSPotential, Slot } from '@/types'
import {
  selectCoreCount,
  usePotentialStore,
  useTrekkerStore,
} from '@/lib/store'
import { MAX_LEVEL, cn } from '@/lib/utils'

type SSPotentialsProps = {
  slot: Slot
  type: 'main' | 'support'
}

const priorities = [
  { value: 'Core', label: 'Core' },
  { value: 'Medium', label: 'Med' },
  { value: 'Low', label: 'Low' },
  { value: 'Optional', label: 'Opt' },
]

function SingleSelected({
  slot,
  p,
  idx,
}: {
  slot: Slot
  p: SSPotential
  idx: number
}) {
  const sel = usePotentialStore((s) =>
    s.potentials[slot].find((sp) => sp.id === p.id),
  )
  const coreCount = usePotentialStore(selectCoreCount(slot))

  const toggle = usePotentialStore((s) => s.togglePotential)
  const updateLevel = usePotentialStore((s) => s.updateLevel)
  const updatePriority = usePotentialStore((s) => s.updatePriority)

  const { ref, isDragging } = useSortable({
    id: p.id,
    index: idx,
    disabled: p.rarity === 0,
  })

  return (
    <div
      ref={ref}
      className={`relative w-full ease-in-out transition-transform duration-300 shadow-md ${isDragging && 'rotate-6 outline-blue-300 outline-3'}`}
    >
      {sel?.picked ? (
        <Button
          className="absolute -top-1 -right-1 m-auto z-10 rounded-full"
          size="icon-xs"
          onClick={() => toggle(slot, p)}
        >
          <RiSubtractFill />
        </Button>
      ) : (
        <Button
          className="absolute -top-1 -right-1 m-auto z-10 rounded-full"
          size="icon-xs"
          onClick={() => toggle(slot, p)}
          disabled={p.rarity === 0 && coreCount === 2}
        >
          <RiThumbUpFill />
        </Button>
      )}
      <div
        data-selected={sel?.picked}
        className="relative data-[selected=true]:after:hidden after:absolute after:inset-0 after:bg-muted/40"
      >
        <ResponsivePotential size="w-18" id={p.id} />
      </div>
      {p.rarity !== 0 && (
        <div className="absolute top-0 bg-white flex w-full rounded-sm">
          {sel?.picked && (
            <Select
              value={sel.level ? String(sel.level) : undefined}
              onValueChange={(value) => {
                if (value == null) return
                updateLevel(slot, p.id, value)
              }}
              defaultValue={'6'}
            >
              <SelectTrigger
                className="text-[10px] justify-start gap-0 pl-1 pr-0 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 text-mauve-800 bg-transparent data-[size=sm]:h-3"
                size="sm"
              >
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
          )}
          <div className="bg-white px-0.5">
            {sel?.picked && (
              <Select
                items={priorities}
                value={sel.priority}
                onValueChange={(value) => {
                  updatePriority(
                    slot,
                    sel.id,
                    value ? (value as PotentialPriority) : 'Medium',
                  )
                }}
                defaultValue="Medium"
              >
                <SelectTrigger
                  className="text-[10px] justify-start gap-0 border-none shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-transparent p-0 text-mauve-800 data-[size=sm]:h-3.25"
                  size="sm"
                >
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent align="start">
                  {priorities.map((item) => (
                    <SelectItem
                      key={item.value}
                      className="text-[10px]"
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function TrekkerGrid({ slot }: SSPotentialsProps) {
  const routeApi = getRouteApi('__root__')
  const { potentials: fetchedPotentials } = routeApi.useLoaderData()
  const trekkerId = useTrekkerStore((s) => s.trekkers[slot])
  const update = usePotentialStore((s) => s.update)
  const pots = usePotentialStore((s) => s.potentials[slot])
  const coreCount = usePotentialStore(selectCoreCount(slot))
  if (!trekkerId) return
  const potentialList = fetchedPotentials[trekkerId]

  return (
    <section className="mt-5">
      <div className="flex flex-col justify-center gap-1 w-full max-w-lg mx-auto bg-muted rounded-sm overflow-hidden">
        <div className="flex justify-between items-center text-sm">
          <h1
            className={cn(
              '[clip-path:polygon(0_0,100%_0,90%_100%,0_100%)] text-center text-sm text-white tracking-tighter pr-6 pl-3 py-1 bg-indigo-500 dark:bg-indigo-700',
              {
                'bg-rose-500 dark:bg-rose-700': slot === 'main',
              },
            )}
          >
            {slot === 'main' ? 'Main' : 'Support'}
          </h1>
          <div className="flex gap-2 px-2 py-1">
            <div>Core(Pink): {coreCount}/2</div>
            <div>Picked: {pots.filter((p) => p.picked).length}</div>
          </div>
        </div>
        <div className="grid grid-cols-[72px_72px_72px_72px] auto-rows-[91.8px] gap-1 px-1 pb-1">
          <div className="col-span-2 row-span-2">
            <SSTrekker id={trekkerId} />
          </div>
          <DragDropProvider
            onDragEnd={(event) => {
              if (event.canceled) return
              // not working
              update(
                slot,
                move(usePotentialStore.getState().potentials[slot], event),
              )
            }}
          >
            {pots.map((s, index) => {
              const p = potentialList[s.id]
              return <SingleSelected key={p.id} slot={slot} p={p} idx={index} />
            })}
          </DragDropProvider>
        </div>
      </div>
    </section>
  )
}
