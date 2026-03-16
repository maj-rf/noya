import type { SSCharacter } from '@/types'

export function searchAndFilter(
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
