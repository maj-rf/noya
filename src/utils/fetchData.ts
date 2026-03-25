import type { SSCharacter, SSPotential } from '@/types'

const BASE =
  'https://raw.githubusercontent.com/maj-rf/StellaSoraData/refs/heads/main'

const fetchCharacters = async (
  lang: string,
): Promise<Record<string, SSCharacter>> => {
  const response = await fetch(`${BASE}/character${lang}.json`)
  return await response.json()
}

const fetchPotentials = async (
  lang: string,
): Promise<Record<string, Record<string, SSPotential>>> => {
  const response = await fetch(`${BASE}/potential${lang}.json`)
  return await response.json()
}

type TData = {
  characters: Record<string, SSCharacter>
  potentials: Record<string, Record<string, SSPotential>>
}

export async function fetchData(): Promise<TData> {
  let lang = localStorage.getItem('lang') ?? 'EN'
  if (!['EN', 'JP', 'TW', 'CN', 'KR'].includes(lang)) {
    localStorage.setItem('lang', 'EN')
    lang = 'EN'
  }

  const [characters, potentials] = await Promise.all([
    fetchCharacters(lang),
    fetchPotentials(lang),
  ])
  return { characters, potentials }
}
