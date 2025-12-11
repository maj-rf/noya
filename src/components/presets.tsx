import { getRouteApi } from '@tanstack/react-router'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import type { SSCharacter } from '@/types'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'

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

export function Presets() {
  const routeApi = getRouteApi('/')
  const characters = routeApi.useLoaderData()

  const setTrekker = useTrekkerStore((s) => s.setAllTrekkers)
  const setPotentials = usePotentialStore((s) => s.setAllPotentials)

  const setPresets = (value: string) => {}
  return (
    <div>
      <Select onValueChange={setPresets}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Preset Team" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Aqua Builds</SelectLabel>
            <SelectItem value="aqua:Chitose">Chitose AA</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
