import { searchAndFilter } from '@/utils/searchAndFilter'

const mockCharacters = [
  {
    id: 133,
    name: 'Nazuka',
    star: 5,
    element: 'Ventus',
    class: 'Versatile',
    attackType: 'Ranged',
    tag: ['Versatile', 'Steady', 'Petal Bloom'],
  },
  {
    id: 156,
    name: 'Nazuna',
    star: 5,
    element: 'Terra',
    class: 'Support',
    attackType: 'Ranged',
    tag: ['Support', 'Collector', 'Petal Bloom'],
  },
  {
    id: 159,
    name: 'Springseek Coronis',
    star: 5,
    element: 'Terra',
    class: 'Versatile',
    attackType: 'Ranged',
    tag: ['Versatile', 'Collector', 'Freelance Trekker'],
  },
]

describe('search and filter', () => {
  it('returns nothing if no match/es', () => {
    const result = searchAndFilter(mockCharacters, 'nazu', 'element:Ignis')
    expect(result).toHaveLength(0)
  })
  it('returns all characters for filter type "all"', () => {
    const result = searchAndFilter(mockCharacters, '', 'all:all')
    expect(result).toHaveLength(3)
  })
  it('returns all characters when no search or filter provided', () => {
    const result = searchAndFilter(mockCharacters)
    expect(result).toHaveLength(3)
  })
  it('filters by name (case-insensitive)', () => {
    const result = searchAndFilter(mockCharacters, 'nazu')
    expect(result).toHaveLength(2)
    expect(result.map((c) => c.id)).toEqual([133, 156])
  })
  it('filters by element', () => {
    const result = searchAndFilter(mockCharacters, '', 'element:Terra')
    expect(result).toHaveLength(2)
  })
  it('filters by attackType', () => {
    const result = searchAndFilter(mockCharacters, '', 'attackType:Ranged')
    expect(result).toHaveLength(3)
  })
  it('filters by rarity', () => {
    const result = searchAndFilter(mockCharacters, '', 'star:5')
    expect(result).toHaveLength(3)
  })
  it('filters by class', () => {
    const result = searchAndFilter(mockCharacters, '', 'class:Support')
    expect(result).toHaveLength(1)
  })
  it('applies both search and filter together', () => {
    const result = searchAndFilter(mockCharacters, 'nazu', 'class:Support')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(156)
  })
})
