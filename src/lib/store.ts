import { create } from 'zustand'
import type {
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
  setAllTrekkers: (trekkers: Trekkers) => void
}

interface PotentialState {
  potentials: Potentials
  addPotential: (slot: Slot, id: SSPotential) => void
  updateLevel: (slot: Slot, id: number, level: number) => void
  updatePriority: (slot: Slot, id: number, value: PotentialPriority) => void
  removePotential: (slot: Slot, id: number) => void
  clearPotentials: (slot: Slot) => void
  setAllPotentials: (potentials: Potentials) => void
}

export const useTrekkerStore = create<TrekkerState>()((set) => ({
  trekkers: { main: null, sub1: null, sub2: null },
  setTrekker: (slot, id) =>
    set((state) => ({
      trekkers: {
        ...state.trekkers,
        [slot]: id,
      },
    })),
  setAllTrekkers: (trekkers) =>
    set(() => ({
      trekkers,
    })),
}))

export const usePotentialStore = create<PotentialState>()((set) => ({
  potentials: { main: {}, sub1: {}, sub2: {} },
  setAllPotentials: (potentials) =>
    set(() => ({
      potentials,
    })),
  addPotential: (slot, p) =>
    set((state) => ({
      potentials: {
        ...state.potentials,
        [slot]: {
          ...state.potentials[slot],
          [p.id]:
            p.rarity === 0
              ? { ...p, rarity: 0, priority: 'Core' }
              : { ...p, level: 1, priority: 'Medium' },
        },
      },
    })),
  updateLevel: (slot, id, level) =>
    set((state) => ({
      potentials: {
        ...state.potentials,
        [slot]: {
          ...state.potentials[slot],
          [id]: { ...state.potentials[slot][id], level },
        },
      },
    })),
  updatePriority: (slot, id, value) =>
    set((state) => ({
      potentials: {
        ...state.potentials,
        [slot]: {
          ...state.potentials[slot],
          [id]: { ...state.potentials[slot][id], priority: value },
        },
      },
    })),
  removePotential: (slot, id) =>
    set((state) => {
      const { [id]: remove, ...rest } = state.potentials[slot]
      return {
        potentials: {
          ...state.potentials,
          [slot]: rest,
        },
      }
    }),
  clearPotentials: (slot) =>
    set((state) => ({
      potentials: {
        ...state.potentials,
        [slot]: {},
      },
    })),
}))
