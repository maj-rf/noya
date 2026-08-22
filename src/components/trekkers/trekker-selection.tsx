import { getRouteApi } from '@tanstack/react-router'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { RiSearch2Line } from '@remixicon/react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import type { Slot } from '@/types'
import { SSTrekker } from '@/components/trekkers/ss-trekker'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLangStore, usePotentialStore, useTrekkerStore } from '@/lib/store'
import { ButtonGroup } from '@/components/ui/button-group'
import { searchAndFilter } from '@/utils/searchAndFilter'
import { getSelectedPots } from '@/utils/getSelectedPots'

const groups: Array<{
  label: string
  items: Array<{ value: string; label: string }>
}> = [
  {
    label: 'Reset',
    items: [{ value: 'all:all', label: 'All' }],
  },
  {
    label: 'By Element',
    items: [
      { value: 'element:Ignis', label: 'Ignis' },
      { value: 'element:Ventus', label: 'Ventus' },
      { value: 'element:Terra', label: 'Terra' },
      { value: 'element:Aqua', label: 'Aqua' },
      { value: 'element:Lux', label: 'Lux' },
      { value: 'element:Umbra', label: 'Umbra' },
    ],
  },
  {
    label: 'By Attack Type',
    items: [
      { value: 'attackType:Ranged', label: 'Ranged' },
      { value: 'attackType:Melee', label: 'Melee' },
    ],
  },
  {
    label: 'By Rarity',
    items: [
      { value: 'star:4', label: '4⭐️' },
      { value: 'star:5', label: '5⭐️' },
    ],
  },
  {
    label: 'By Class',
    items: [
      { value: 'class:Vanguard', label: 'Vanguard' },
      { value: 'class:Versatile', label: 'Versatile' },
      { value: 'class:Support', label: 'Support' },
    ],
  },
]

export const TrekkerSelection = () => {
  const routeApi = getRouteApi('__root__')
  const { characters: fetchedCharacters, potentials } = routeApi.useLoaderData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const setTrekker = useTrekkerStore((s) => s.setTrekker)
  const update = usePotentialStore((s) => s.update)
  const clearPotentials = usePotentialStore((s) => s.clearPotentials)
  const trekkers = useTrekkerStore((s) => s.trekkers)
  const lang = useLangStore((s) => s.lang)
  const characters = useMemo(
    () => Object.values(fetchedCharacters),
    [fetchedCharacters],
  )

  const filteredChars = useMemo(
    () => searchAndFilter(characters, lang, search, filter),
    [characters, lang, search, filter],
  )

  const trekkerIds = useMemo(
    () =>
      new Set(
        Object.values(trekkers)
          .filter(Boolean)
          .map((t) => t),
      ),
    [trekkers],
  )

  const updateTrekkers = useCallback(
    (s: Slot, char: number | null) => {
      const alreadyExists = trekkerIds.has(char)
      const isSameSlot = trekkers[s] === char
      if (isSameSlot) {
        setTrekker(s, null)
        clearPotentials(s)
        return
      } else if (alreadyExists) {
        return
      } else {
        setTrekker(s, char)
        update(
          s,
          getSelectedPots(potentials[char!], s === 'main' ? 'main' : 'support'),
        )
      }
    },
    [trekkers, setTrekker, clearPotentials, update],
  )
  const [slot, setSlot] = useState<Slot>('main')

  return (
    <section className="w-full">
      <ButtonGroup
        className="justify-center items-center w-full mb-2"
        aria-label="Trekker slot group"
      >
        <Button
          variant={slot === 'main' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => setSlot('main')}
        >
          Main
        </Button>
        <Button
          variant={slot === 'sub1' ? 'default' : 'secondary'}
          onClick={() => setSlot('sub1')}
          size="sm"
        >
          Support 1
        </Button>
        <Button
          variant={slot === 'sub2' ? 'default' : 'secondary'}
          onClick={() => setSlot('sub2')}
          size="sm"
        >
          Support 2
        </Button>
      </ButtonGroup>
      <div className="w-full grid grid-cols-[1fr_0.5fr] gap-2 mb-2 px-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <RiSearch2Line />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {filteredChars.length +
              `${filteredChars.length === 1 ? ' result' : ' results'}`}
          </InputGroupAddon>
        </InputGroup>
        <Select
          items={groups}
          value={filter}
          onValueChange={(value) => {
            if (value == null) return
            setFilter(value)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <Fragment key={group.label}>
                <SelectGroup>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.items.map((item) => (
                    <SelectItem key={item.label} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </Fragment>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-120 w-full px-2">
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {filteredChars.map((char) => (
            <div
              key={char.id}
              onClick={() => updateTrekkers(slot, char.id)}
              data-disabled={trekkerIds.has(char.id)}
              data-selected={trekkers[slot] === char.id}
              data-slot={slot === 'main' ? 'Main' : 'Support'}
              className="chosen-trekker group rounded-xs data-[selected=true]:outline-2 h-31.25 w-25 md:h-37.5 md:w-30 aspect-[0.8]"
            >
              <SSTrekker id={char.id} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  )
}
