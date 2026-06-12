import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_LEVEL } from './utils'
import type {
  BuildMap,
  PotentialPriority,
  Potentials,
  SSPotential,
  Slot,
  Trekkers,
} from '@/types'

interface TrekkerState {
  trekkers: Trekkers

  // actions
  setTrekker: (slot: Slot, id: number | null) => void
}

interface PotentialState {
  potentials: Potentials
  addPotential: (slot: Slot, p: Pick<SSPotential, 'id' | 'rarity'>) => void
  updateLevel: (slot: Slot, id: number, level: string) => void
  updatePriority: (slot: Slot, id: number, value: PotentialPriority) => void
  removePotential: (slot: Slot, id: number) => void
  reorder: (update: Potentials) => void
  clearPotentials: (slot: Slot) => void
}

interface BuildState {
  builds: BuildMap
  save: (id: string, name: string) => void
  remove: (id: string) => void
}

interface LangState {
  lang: 'EN' | 'JP' | 'KR' | 'CN' | 'TW'
  change: (lang: 'EN' | 'JP' | 'KR' | 'CN' | 'TW') => void
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: 'EN',
      change: (lang) => set({ lang }),
    }),
    {
      name: 'lang',

      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name)

          return value
            ? {
                state: { lang: JSON.parse(value) },
                version: 0,
              }
            : null
        },

        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value.state.lang))
        },

        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    },
  ),
)

export const useBuildStore = create<BuildState>()(
  persist(
    (set) => ({
      builds: {},
      save: (id, name) => {
        const trekkers = useTrekkerStore.getState().trekkers
        const potentials = usePotentialStore.getState().potentials
        if (!trekkers.main || !name) return
        set((state) => ({
          builds: {
            ...state.builds,
            [id]: { id, trekkers, potentials, name },
          },
        }))
      },
      remove: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.builds
          return { builds: rest }
        }),
    }),
    {
      name: 'saved-builds',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // version 0 → 1: convert potentials from object to array
          const builds = persistedState.builds ?? {}
          const migratedBuilds = Object.fromEntries(
            Object.entries(builds).map(([id, build]: [string, any]) => [
              id,
              {
                ...build,
                potentials: Object.fromEntries(
                  Object.entries(build.potentials ?? {}).map(
                    ([slot, slotValue]: [string, any]) => [
                      slot,
                      Object.values(slotValue), // Record<string, SelectedPotential> → Array<SelectedPotential>
                    ],
                  ),
                ),
              },
            ]),
          )
          return { ...persistedState, builds: migratedBuilds }
        }
        return persistedState
      },
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name)
          if (!value) return null
          // if old format (raw builds object), wrap it so migrate can handle it
          const parsed = JSON.parse(value)
          const isLegacy = !parsed.version
          return isLegacy ? { version: 0, state: { builds: parsed } } : parsed
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value.state.builds))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
)

export const useTrekkerStore = create<TrekkerState>()((set) => ({
  trekkers: { main: null, sub1: null, sub2: null },
  setTrekker: (slot, id) =>
    set((state) => ({
      trekkers: {
        ...state.trekkers,
        [slot]: id,
      },
    })),
}))

export const usePotentialStore = create<PotentialState>()((set) => ({
  potentials: { main: [], sub1: [], sub2: [] },
  addPotential: (slot, p) =>
    set((state) => ({
      potentials: {
        ...state.potentials,
        [slot]: [
          ...state.potentials[slot],
          p.rarity === 0
            ? { ...p, rarity: 0, priority: 'Core' }
            : { ...p, level: MAX_LEVEL, priority: 'Medium' },
        ],
      },
    })),
  updateLevel: (slot, id, level) =>
    set((state) => {
      const index = state.potentials[slot].findIndex((item) => item.id === id)
      const item = { ...state.potentials[slot][index] }
      const updated = [...state.potentials[slot]]
      item.level = level
      updated[index] = item
      return {
        potentials: {
          ...state.potentials,
          [slot]: updated,
        },
      }
    }),
  updatePriority: (slot, id, value) =>
    set((state) => {
      const index = state.potentials[slot].findIndex((item) => item.id === id)
      const item = { ...state.potentials[slot][index] }
      const updated = [...state.potentials[slot]]
      item.priority = value
      updated[index] = item
      return {
        potentials: {
          ...state.potentials,
          [slot]: updated,
        },
      }
    }),
  removePotential: (slot, id) =>
    set((state) => {
      const filtered = state.potentials[slot].filter((p) => p.id !== id)
      return {
        potentials: {
          ...state.potentials,
          [slot]: filtered,
        },
      }
    }),
  reorder: (update) =>
    set(() => {
      return {
        potentials: update,
      }
    }),
  clearPotentials: (slot) =>
    set((state) => ({
      potentials: {
        ...state.potentials,
        [slot]: [],
      },
    })),
}))
