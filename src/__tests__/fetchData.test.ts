import { beforeEach } from 'vitest'
import { fetchData } from '@/utils/fetchData'

vi.mock('./fetchCharacters', () => ({ fetchCharacters: vi.fn() }))
vi.mock('./fetchPotentials', () => ({ fetchPotentials: vi.fn() }))

const mockCharacters = {
  '107': {
    id: 107,
    name: 'Tilia',
    star: 4,
    element: 'Lux',
    class: 'Support',
    attackType: 'Melee',
    tag: ['Support', 'Steady', 'Imperial Guard'],
  },
}

const mockPotentials = {
  '107': {
    '510701': {
      name: 'Shield Counter',
      briefDesc:
        'When Tilia is immune to damage in Fortify Stance, increases her Counterattack DMG.',
      type: 'main',
      rarity: 0,
      imgId: '10701_Potential_01',
      id: 510701,
    },
    '510702': {
      name: 'Perfect Triangle Formation',
      briefDesc:
        'When Tilia is immune to DMG in Fortify Stance, she gains Aegis that grants immunity.',
      type: 'main',
      rarity: 0,
      imgId: '10701_Potential_02',
      id: 510702,
    },
  },
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockCharacters),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPotentials),
      }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('fetching character and potential data', () => {
  it('returns merged data from fetches and localStorage', async () => {
    localStorage.setItem('saved-builds', JSON.stringify({ build1: [103] }))
    const result = await fetchData()
    expect(result.characters).toEqual(mockCharacters)
    expect(result.potentials).toEqual(mockPotentials)
    expect(result.savedBuilds).toEqual({ build1: [103] })
  })

  it('returns empty savedBuilds if localStorage is empty', async () => {
    const result = await fetchData()
    expect(result.savedBuilds).toEqual({})
  })

  it('handles invalid localStorage JSON gracefully', async () => {
    localStorage.setItem('saved-builds', 'invalid json')
    await expect(fetchData()).rejects.toThrow()
  })
})
