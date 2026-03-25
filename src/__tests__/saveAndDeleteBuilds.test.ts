import type { Potentials, Trekkers } from '@/types'
import { useBuildStore, usePotentialStore, useTrekkerStore } from '@/lib/store'

const mockTrekkers: Trekkers = { main: 103, sub1: 112, sub2: 111 }
const mockPotentials: Potentials = {
  main: {
    511903: { id: 511903, rarity: 0, priority: 'Core' },
    511904: { id: 511904, rarity: 0, priority: 'Core' },
    511912: { id: 511912, rarity: 2, level: '1+', priority: 'Optional' },
  },
  sub1: {
    513323: { id: 513323, rarity: 0, priority: 'Core' },
    513324: { id: 513324, rarity: 0, priority: 'Core' },
  },
  sub2: {
    512321: { id: 512321, rarity: 0, priority: 'Core' },
    512323: { id: 512323, rarity: 0, priority: 'Core' },
  },
}

beforeEach(() => {
  useBuildStore.setState({ builds: {} })
  useTrekkerStore.setState({ trekkers: mockTrekkers })
  usePotentialStore.setState({ potentials: mockPotentials })
})

describe('saving builds', () => {
  it('saves a build to localStorage', () => {
    useBuildStore.getState().save('uuid-1', 'My Build')
    const builds = useBuildStore.getState().builds
    expect(builds['uuid-1']).toEqual({
      id: 'uuid-1',
      name: 'My Build',
      trekkers: mockTrekkers,
      potentials: mockPotentials,
    })
  })

  it('does not save if main trekker is missing', () => {
    useTrekkerStore.setState({
      trekkers: { main: null, sub1: null, sub2: null },
    })
    useBuildStore.getState().save('uuid-1', 'My Build')
    expect(useBuildStore.getState().builds).toEqual({})
  })

  it('does not save if build name is missing', () => {
    useBuildStore.getState().save('uuid-2', '')
    expect(useBuildStore.getState().builds).toEqual({})
  })

  it('appends to existing builds without overwriting', () => {
    useBuildStore.getState().save('uuid-1', 'Build One')
    useBuildStore.getState().save('uuid-2', 'Build Two')
    expect(Object.keys(useBuildStore.getState().builds)).toHaveLength(2)
  })
})

describe('delete builds', () => {
  it('deletes an existing build', () => {
    useBuildStore.getState().save('uuid-1', 'My Build')
    useBuildStore.getState().remove('uuid-1')
    expect(useBuildStore.getState().builds['uuid-1']).toBeUndefined()
  })
  it('does nothing if build id does not exist', () => {
    useBuildStore.getState().save('uuid-1', 'My Build')
    useBuildStore.getState().remove('non-existent-id')
    expect(Object.keys(useBuildStore.getState().builds)).toHaveLength(1)
  })
  it('handles empty localStorage gracefully when deleting', () => {
    expect(() => useBuildStore.getState().remove('uuid-1')).not.toThrow()
  })
})
