import { getRouteApi } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useState } from 'react'
import type { SSCharacter, Trekkers } from '@/types'
import { SSAvatar } from '@/components/ss-avatar'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ScrollArea } from '@/components/ui/scroll-area'

export const AvatarSelection = ({
  k,
  trekkers,
  updateTrekkers,
}: {
  k: string
  trekkers: Trekkers
  updateTrekkers: (key: string, char: SSCharacter) => void
}) => {
  const routeApi = getRouteApi('/')
  const fetchedCharacters = routeApi.useLoaderData()
  const [search, setSearch] = useState('')
  const characters = Object.entries(fetchedCharacters).map(([_, char]) => char)
  const filteredChars = search
    ? characters.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      )
    : characters

  return (
    <section>
      <div className="w-full max-w-2xl mb-2 px-4">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          {search && (
            <InputGroupAddon align="inline-end">
              {filteredChars.length +
                `${filteredChars.length === 1 ? ' result' : ' results'}`}
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>
      <ScrollArea className="h-100 px-2">
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {filteredChars.map((char) => {
            const { potential, ...avatar } = char
            return (
              <div
                key={char.id}
                onClick={() => updateTrekkers(k, char)}
                data-disabled={Object.values(trekkers).some(
                  (t) => t?.id === char.id,
                )}
                data-selected={trekkers[k as keyof Trekkers]?.id === char.id}
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
