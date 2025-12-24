import { describe, it, expect } from 'vitest'
import type { SelectedPotential, PotentialPriority } from '../types'

const PRIORITY_ORDER: Record<PotentialPriority, number> = {
    Core: 0,
    Medium: 1,
    Optional: 2,
}

function sortPotentials(potentials: SelectedPotential[]): SelectedPotential[] {
    return [...potentials].sort((a, b) => {
        if (a.priority !== b.priority) {
            return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        }
        return a.selectionTimestamp - b.selectionTimestamp
    })
}

describe('Potential Sorting Logic', () => {
    it('should sort by priority (Core > Medium > Optional)', () => {
        const potentials: any[] = [
            { id: 1, priority: 'Optional', selectionTimestamp: 100 },
            { id: 2, priority: 'Medium', selectionTimestamp: 200 },
            { id: 3, priority: 'Core', selectionTimestamp: 300 },
        ]
        const sorted = sortPotentials(potentials)
        expect(sorted[0].id).toBe(3) // Core
        expect(sorted[1].id).toBe(2) // Medium
        expect(sorted[2].id).toBe(1) // Optional
    })

    it('should sort by selection order within the same priority', () => {
        const potentials: any[] = [
            { id: 1, priority: 'Medium', selectionTimestamp: 500 },
            { id: 2, priority: 'Medium', selectionTimestamp: 100 },
            { id: 3, priority: 'Medium', selectionTimestamp: 300 },
        ]
        const sorted = sortPotentials(potentials)
        expect(sorted[0].id).toBe(2) // Earliest
        expect(sorted[1].id).toBe(3) // Middle
        expect(sorted[2].id).toBe(1) // Latest
    })

    it('should correctly handle mixed priorities and timestamps', () => {
        const potentials: any[] = [
            { id: 1, priority: 'Optional', selectionTimestamp: 10 },
            { id: 2, priority: 'Core', selectionTimestamp: 100 },
            { id: 3, priority: 'Medium', selectionTimestamp: 5 },
            { id: 4, priority: 'Medium', selectionTimestamp: 50 },
        ]
        const sorted = sortPotentials(potentials)
        expect(sorted[0].id).toBe(2) // Core
        expect(sorted[1].id).toBe(3) // Medium (earlier)
        expect(sorted[2].id).toBe(4) // Medium (later)
        expect(sorted[3].id).toBe(1) // Optional
    })
})
