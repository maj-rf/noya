import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { snapdom } from '@zumer/snapdom'
import { useTrekkerStore } from './trekker-store'
import { CONFIG } from '@/config'
import type { SnapdomPlugin } from '@zumer/snapdom'
import type { ClassValue } from 'clsx'
import type { SSCharacter, TAvatar, Trekkers } from '@/types'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export async function fetchCharacters(): Promise<Record<string, SSCharacter>> {
  const response = await fetch(CONFIG.DATA_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch characters')
  }
  return response.json()
}

export function initializeDefaultTrekkers(characters: Record<string, SSCharacter>) {
  useTrekkerStore.setState({
    trekkers: {
      main: characters[103],
      sub1: characters[112],
      sub2: characters[111],
    },
  })
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
