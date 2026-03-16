// indexLoader.test.ts
import { useTrekkerStore } from '@/lib/store'

// the loader logic extracted for testing
function indexLoader() {
  if (
    Object.values(useTrekkerStore.getState().trekkers).some((a) => a !== null)
  ) {
    return
  }
  useTrekkerStore.setState({
    trekkers: { main: 103, sub1: 112, sub2: 111 },
  })
}

beforeEach(() => {
  useTrekkerStore.setState({ trekkers: { main: null, sub1: null, sub2: null } })
})

describe('index loader', () => {
  it('sets default trekkers when store is empty', () => {
    indexLoader()
    expect(useTrekkerStore.getState().trekkers).toEqual({
      main: 103,
      sub1: 112,
      sub2: 111,
    })
  })

  it('does not overwrite trekkers if already set (HMR guard)', () => {
    useTrekkerStore.setState({
      trekkers: { main: 999, sub1: null, sub2: null },
    })
    indexLoader()
    expect(useTrekkerStore.getState().trekkers.main).toBe(999)
  })
})
