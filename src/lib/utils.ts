import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { snapdom } from '@zumer/snapdom'
import type { ClassValue } from 'clsx'

export const MAX_LEVEL = 6

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export async function downloadImage(element: HTMLElement | null) {
  if (!element) return
  const result = await snapdom(element, {
    width: 1600,
    embedFonts: true,
    outerShadows: true,
  })
  await result.download({ filename: 'my-ss-build' })
}
