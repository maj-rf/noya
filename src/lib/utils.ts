import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { snapdom } from '@zumer/snapdom'
import type { ClassValue } from 'clsx'
import type { SSCharacter, TAvatar, Trekkers } from '@/types'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export async function fetchCharacters(): Promise<Array<SSCharacter>> {
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

export async function downloadImage(element: HTMLElement | null) {
  if (!element) return
  const result = await snapdom(element)
  await result.download({ filename: 'my-ss-build' })
}
