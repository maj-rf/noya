import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { snapdom } from '@zumer/snapdom'
import type { BuildMap, SSCharacter, SSPotential } from '@/types'
import type { SnapdomPlugin } from '@zumer/snapdom'
import type { ClassValue } from 'clsx'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'

export function saveToLocal(id: string, name: string) {
  const potentials = usePotentialStore.getState().potentials
  const trekkers = useTrekkerStore.getState().trekkers
  if (!trekkers.main) return
  const buildsJSON = localStorage.getItem('saved-builds')
  const builds: BuildMap = buildsJSON ? JSON.parse(buildsJSON) : {}
  builds[id] = { id, trekkers, potentials, name }
  localStorage.setItem('saved-builds', JSON.stringify(builds))
}

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
