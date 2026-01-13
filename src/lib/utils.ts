import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { snapdom } from '@zumer/snapdom'
import { useTrekkerStore } from './store'
import type { BuildMap, SSPotential } from './../types'
import type { SnapdomPlugin } from '@zumer/snapdom'
import type { ClassValue } from 'clsx'
import type { SSCharacter } from '@/types'

export const MAX_LEVEL = 6

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

const fetchCharacters = async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/maj-rf/StellaSoraData/refs/heads/main/character.json',
  )
  return await response.json()
}

const fetchPotentials = async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/maj-rf/StellaSoraData/refs/heads/main/potential.json',
  )
  return await response.json()
}

type TData = {
  characters: Record<string, SSCharacter>
  potentials: Record<string, Record<string, SSPotential>>
  savedBuilds: BuildMap
}

export async function fetchData(): Promise<TData> {
  const [characters, potentials] = await Promise.all([
    fetchCharacters(),
    fetchPotentials(),
  ])
  const buildsJSON = localStorage.getItem('saved-builds')
  const savedBuilds = buildsJSON ? JSON.parse(buildsJSON) : {}
  // for HMR in dev
  if (
    Object.values(useTrekkerStore.getState().trekkers).some((a) => a !== null)
  ) {
    return { characters, potentials, savedBuilds }
  } else {
    useTrekkerStore.setState({
      trekkers: {
        main: 103,
        sub1: 112,
        sub2: 111,
      },
    })
  }
  return { characters, potentials, savedBuilds }
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
