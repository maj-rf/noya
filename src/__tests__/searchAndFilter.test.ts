import { searchAndFilter } from '@/utils/searchAndFilter'

const mockCharacters = [
  {
    id: 133,
    name: {
      EN: 'Nazuka',
      KR: '나츠카',
      JP: 'ナツカ',
      CN: '夏花',
      TW: '夏花',
    },
    star: 5,
    element: 'Ventus',
    class: 'Versatile',
    attackType: 'Ranged',
  },
  {
    id: 156,
    name: {
      EN: 'Nazuna',
      KR: '나즈나',
      JP: 'ナズナ',
      CN: '小禾',
      TW: '小禾',
    },
    star: 5,
    element: 'Terra',
    class: 'Support',
    attackType: 'Ranged',
  },
  {
    id: 159,
    name: {
      EN: 'Springseek Coronis',
      KR: '크루니스(새해)',
      JP: 'クルニス（華服）',
      CN: '科洛妮丝（新春）',
      TW: '緋春柯洛妮絲',
    },
    star: 5,
    element: 'Terra',
    class: 'Versatile',
    attackType: 'Ranged',
  },
]

describe('search and filter', () => {
  it('returns nothing if no match/es', () => {
    const result = searchAndFilter(
      mockCharacters,
      'EN',
      'nazu',
      'element:Ignis',
    )
    expect(result).toHaveLength(0)
  })
  it('returns all characters for filter type "all"', () => {
    const result = searchAndFilter(mockCharacters, 'EN', '', 'all:all')
    expect(result).toHaveLength(3)
  })
  it('returns all characters when no search or filter provided', () => {
    const result = searchAndFilter(mockCharacters, 'EN')
    expect(result).toHaveLength(3)
  })
  it('filters by name (case-insensitive)', () => {
    const result = searchAndFilter(mockCharacters, 'EN', 'nazu')
    expect(result).toHaveLength(2)
    expect(result.map((c) => c.id)).toEqual([133, 156])
  })
  it('filters by element', () => {
    const result = searchAndFilter(mockCharacters, 'EN', '', 'element:Terra')
    expect(result).toHaveLength(2)
  })
  it('filters by attackType', () => {
    const result = searchAndFilter(
      mockCharacters,
      'EN',
      '',
      'attackType:Ranged',
    )
    expect(result).toHaveLength(3)
  })
  it('filters by rarity', () => {
    const result = searchAndFilter(mockCharacters, 'EN', '', 'star:5')
    expect(result).toHaveLength(3)
  })
  it('filters by class', () => {
    const result = searchAndFilter(mockCharacters, 'EN', '', 'class:Support')
    expect(result).toHaveLength(1)
  })
  it('applies both search and filter together', () => {
    const result = searchAndFilter(
      mockCharacters,
      'EN',
      'nazu',
      'class:Support',
    )
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(156)
  })
})
