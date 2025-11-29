import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { snapdom } from '@zumer/snapdom'
import type { SnapdomPlugin } from '@zumer/snapdom'
import type { ClassValue } from 'clsx'
import type { SSCharacter, TAvatar, Trekkers } from '@/types'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export async function fetchCharacters(): Promise<Record<string, SSCharacter>> {
  const response = await fetch(
    'https://raw.githubusercontent.com/maj-rf/StellaSoraData/refs/heads/main/character.json',
  )
  if (!response.ok) {
    throw new Error('Failed to fetch characters')
  }
  const characters = await response.json()
  return characters
}

export function getTrekkersWithoutPotentials(trekkers: Trekkers) {
  const obj = Object.entries(trekkers).reduce(
    (acc, [key, value]) => {
      if (value) {
        const { potential, ...rest } = value
        acc[key as keyof Trekkers] = rest
      } else {
        acc[key as keyof Trekkers] = null
      }
      return acc
    },
    {} as Record<'main' | 'sub1' | 'sub2', null | TAvatar>,
  )

  return obj
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
        target.style.width = 1280 + 'px'
      }
    },
  }
}

export async function downloadImage(element: HTMLElement | null) {
  if (!element) return
  const result = await snapdom(element, {
    plugins: [forceDisplayPlugin],
    width: 1280,
    embedFonts: true,
    quality: 2,
    outerShadows: true,
  })
  await result.download({ filename: 'my-ss-build' })
}
