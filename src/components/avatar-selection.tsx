import { getRouteApi } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import type { SSCharacter, Slot } from '@/types'
import { SSAvatar } from '@/components/ss-avatar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'
import { ButtonGroup } from '@/components/ui/button-group'

function getSearchedAndFilteredCharacters(
  characters: Array<SSCharacter>,
  search?: string,
  filter?: string,
) {
  return characters.filter((c) => {
    // Check search condition
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }

    // Check filter condition
    if (filter) {
      const [type, value] = filter.split(':')
      if (type == 'all') return true
      if (
        type === 'star' &&
        Number(c[type as keyof SSCharacter]) === Number(value)
      ) {
        return true
      }
      if (c[type as keyof SSCharacter] !== value) {
        return false
      }
    }

    return true
  })
}

export const AvatarSelection = () => {
  const routeApi = getRouteApi('/')
  const fetchedCharacters = routeApi.useLoaderData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const setTrekker = useTrekkerStore((s) => s.setTrekker)
  const clearPotentials = usePotentialStore((s) => s.clearPotentials)
  const trekkers = useTrekkerStore((s) => s.trekkers)
  const characters = useMemo(
    () => Object.values(fetchedCharacters),
    [fetchedCharacters],
  )

  const filteredChars = useMemo(
    () => getSearchedAndFilteredCharacters(characters, search, filter),
    [characters, search, filter],
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
        clearPotentials(s)
      }
    },
    [trekkers, setTrekker, clearPotentials],
  )
  const [slot, setSlot] = useState<Slot>('main')

  return (
    <section>
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
      <div className="w-full max-w-2xl grid grid-cols-[1fr_0.5fr] gap-2 mb-2 px-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {filteredChars.length +
              `${filteredChars.length === 1 ? ' result' : ' results'}`}
          </InputGroupAddon>
        </InputGroup>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Reset</SelectLabel>
              <SelectItem value={'all:all'}>All</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>By Element</SelectLabel>
              <SelectItem value="element:Ignis">Ignis</SelectItem>
              <SelectItem value="element:Ventus">Ventus</SelectItem>
              <SelectItem value="element:Terra">Terra</SelectItem>
              <SelectItem value="element:Aqua">Aqua</SelectItem>
              <SelectItem value="element:Lux">Lux</SelectItem>
              <SelectItem value="element:Umbra">Umbra</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>By Attack Type</SelectLabel>
              <SelectItem value="attackType:Ranged">Ranged</SelectItem>
              <SelectItem value="attackType:Melee">Melee</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>By Rarity</SelectLabel>
              <SelectItem value="star:4">4⭐️</SelectItem>
              <SelectItem value="star:5">5⭐️</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>By Tag</SelectLabel>
              <SelectItem value="class:Vanguard">Vanguard</SelectItem>
              <SelectItem value="class:Versatile">Versatile</SelectItem>
            </SelectGroup>
            <SelectItem value="class:Support">Support</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[300px] px-2">
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {filteredChars.map((char) => (
            <div
              key={char.id}
              onClick={() => updateTrekkers(slot, char.id)}
              data-disabled={trekkerIds.has(char.id)}
              data-selected={trekkers[slot] === char.id}
              data-slot={slot === 'main' ? 'Main' : 'Support'}
              className="chosen-trekker group rounded-xs data-[selected=true]:outline-2 h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8]"
            >
              <SSAvatar id={char.id} />
            </div>
          ))}
        </div>
      </ScrollArea>
    </section>
  )
}
