import { getRouteApi } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import type { SSCharacter, Slot, Trekkers } from '@/types'
import { SSAvatar } from '@/components/ss-avatar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTrekkerStore } from '@/lib/trekker-store'

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

export const AvatarSelection = ({
  slot,
  trekkers,
}: {
  slot: Slot
  trekkers: Trekkers
}) => {
  const routeApi = getRouteApi('/')
  const fetchedCharacters = routeApi.useLoaderData()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const characters = Object.entries(fetchedCharacters).map(([_, char]) => char)
  const filteredChars = getSearchedAndFilteredCharacters(
    characters,
    search,
    filter,
  )
  const setTrekker = useTrekkerStore((s) => s.setTrekker)
  const clearPotentials = useTrekkerStore((s) => s.clearPotentials)

  const updateTrekkers = (s: Slot, char: SSCharacter) => {
    const alreadyExists = Object.values(trekkers).some((t) => t?.id === char.id)
    const isSameSlot = trekkers[s]?.id === char.id
    if (isSameSlot) {
      setTrekker(s, null)
      clearPotentials(s)
    } else if (alreadyExists) {
      return
    } else {
      setTrekker(s, char)
      clearPotentials(s)
    }
  }

  return (
    <section>
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
            <SelectItem value={'all:all'}>All</SelectItem>
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
      <ScrollArea className="h-100 px-2">
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {filteredChars.map((char) => {
            const { potential, ...avatar } = char
            return (
              <div
                key={char.id}
                onClick={() => updateTrekkers(slot, char)}
                data-disabled={Object.values(trekkers).some(
                  (t) => t?.id === char.id,
                )}
                data-selected={trekkers[slot]?.id === char.id}
                className="group outline-blue-600 rounded-xs data-[selected=true]:outline-2 h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8]"
              >
                <SSAvatar char={avatar} />
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </section>
  )
}
