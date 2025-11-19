import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'
import type { SSCharacter } from '@/types'

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
