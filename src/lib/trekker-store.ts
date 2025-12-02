import { create } from 'zustand'
import type {
  PotentialPriority,
  SSCharacter,
  SSPotential,
  SelectedPotentialMap,
  Slot,
} from '@/types'

interface TrekkerState {
  trekkers: {
    main: SSCharacter | null
    sub1: SSCharacter | null
    sub2: SSCharacter | null
  }
  potentials: {
    main: SelectedPotentialMap
    sub1: SelectedPotentialMap
    sub2: SelectedPotentialMap
  }
  // actions
  setTrekker: (slot: Slot, char: SSCharacter | null) => void
  addPotential: (slot: Slot, p: SSPotential) => void
  updateLevel: (slot: Slot, id: number, level: number) => void
  updatePriority: (slot: Slot, id: number, value: PotentialPriority) => void
  removePotential: (slot: Slot, id: number) => void
  clearPotentials: (slot: Slot) => void
}

export const useTrekkerStore = create<TrekkerState>()((set) => ({
  trekkers: { main: null, sub1: null, sub2: null },
  potentials: { main: {}, sub1: {}, sub2: {} },

  setTrekker: (slot, char) =>
    set((state) => ({
      trekkers: {
        ...state.trekkers,
        [slot]: char,
      },
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
