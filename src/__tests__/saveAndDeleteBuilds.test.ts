import type { Potentials, Trekkers } from '@/types'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'
import { deleteBuild, saveToLocal } from '@/utils/saveAndDeleteBuilds'

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
  localStorage.clear()
  useTrekkerStore.setState({ trekkers: mockTrekkers })
  usePotentialStore.setState({ potentials: mockPotentials })
})

describe('saving builds', () => {
  it('saves a build to localStorage', () => {
    saveToLocal('uuid-1', 'My Build')
    const builds = JSON.parse(localStorage.getItem('saved-builds')!)
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
    saveToLocal('uuid-1', 'My Build')
    expect(localStorage.getItem('saved-builds')).toBeNull()
  })

  it('does not save if build name is missing', () => {
    saveToLocal('uuid-2', '')
    const builds = JSON.parse(localStorage.getItem('saved-builds')!)
    expect(builds).toBeNull()
  })
  it('appends to existing builds without overwriting', () => {
    saveToLocal('uuid-1', 'Build One')
    saveToLocal('uuid-2', 'Build Two')
    const builds = JSON.parse(localStorage.getItem('saved-builds')!)
    expect(Object.keys(builds)).toHaveLength(2)
  })
})

describe('delete builds', () => {
  it('deletes an existing build', () => {
    saveToLocal('uuid-1', 'My Build')
    deleteBuild('uuid-1')
    const builds = JSON.parse(localStorage.getItem('saved-builds')!)
    expect(builds).toEqual({})
  })
  it('does nothing if build id does not exist', () => {
    saveToLocal('uuid-1', 'My Build')
    deleteBuild('non-existent-id')
    const builds = JSON.parse(localStorage.getItem('saved-builds')!)
    expect(Object.keys(builds)).toHaveLength(1)
  })
  it('handles empty localStorage gracefully when deleting', () => {
    expect(() => deleteBuild('uuid-1')).not.toThrow()
  })
})
