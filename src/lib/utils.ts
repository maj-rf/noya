import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { snapdom } from '@zumer/snapdom'
import { useTrekkerStore } from './store'
import type { SSPotential } from './../types'
import type { SnapdomPlugin } from '@zumer/snapdom'
import type { ClassValue } from 'clsx'
import type { SSCharacter } from '@/types'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

// export async function fetchCharacters(): Promise<Record<string, SSCharacter>> {
//   const response = await fetch(
//     'https://raw.githubusercontent.com/maj-rf/StellaSoraData/refs/heads/main/character.json',
//   )
//   if (!response.ok) {
//     throw new Error('Failed to fetch characters')
//   }
//   const characters = await response.json()

//   useTrekkerStore.setState({
//     trekkers: {
//       main: 103,
//       sub1: 112,
//       sub2: 111,
//     },
//   })
//   return characters
// }

const fetchCharacters = async () => {
  const response = await fetch('./character.json')
  return await response.json()
}

const fetchPotentials = async () => {
  const response = await fetch('./potential.json')
  return await response.json()
}

type TData = {
  characters: Record<string, SSCharacter>
  potentials: Record<string, Record<string, SSPotential>>
}

export async function fetchData(): Promise<TData> {
  const [characters, potentials] = await Promise.all([
    fetchCharacters(),
    fetchPotentials(),
  ])
  // for HMR in dev
  if (
    Object.values(useTrekkerStore.getState().trekkers).some((a) => a !== null)
  ) {
    return { characters, potentials }
  } else {
    useTrekkerStore.setState({
      trekkers: {
        main: 103,
        sub1: 112,
        sub2: 111,
      },
    })
  }
  return { characters, potentials }
}

export function forceDisplayPlugin(): SnapdomPlugin {
  return {
    name: 'force-display-plugin',

    afterClone(context) {
      const clone = context.clone
      if (!clone) return
      const target = clone.querySelector<HTMLElement>('#preview')
      if (target) {
        // target.style.setProperty('display', 'block', 'important')
        target.style.width = 1440 + 'px'
      }
    },
  }
}

export async function downloadImage(element: HTMLElement | null) {
  if (!element) return
  const result = await snapdom(element, {
    plugins: [forceDisplayPlugin],
    width: 1440,
    embedFonts: true,
    quality: 2,
    outerShadows: true,
  })
  await result.download({ filename: 'my-ss-build' })
}
