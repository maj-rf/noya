import type { SSCharacter, SSPotential } from '@/types'
import { useLangStore } from '@/lib/store'

const BASE =
  'https://raw.githubusercontent.com/maj-rf/StellaSoraData/refs/heads/main'

const fetchCharacters = async (): Promise<Record<string, SSCharacter>> => {
  const response = await fetch(`${BASE}/character.json`)
  return await response.json()
}

const fetchPotentials = async (): Promise<
  Record<string, Record<string, SSPotential>>
> => {
  const response = await fetch(`${BASE}/potential.json`)
  return await response.json()
}

type TData = {
  characters: Record<string, SSCharacter>
  potentials: Record<string, Record<string, SSPotential>>
}

export async function fetchData(): Promise<TData> {
  const lang = useLangStore.getState().lang
  if (!['EN', 'JP', 'TW', 'CN', 'KR'].includes(lang)) {
    useLangStore.setState({ lang: 'EN' })
  }

  const [characters, potentials] = await Promise.all([
    fetchCharacters(),
    fetchPotentials(),
  ])
  return { characters, potentials }
}
