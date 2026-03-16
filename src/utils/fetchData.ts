import type { BuildMap, SSCharacter, SSPotential } from '@/types'

const fetchCharacters = async (): Promise<Record<string, SSCharacter>> => {
  const response = await fetch(
    'https://raw.githubusercontent.com/maj-rf/StellaSoraData/refs/heads/main/character.json',
  )
  return await response.json()
}

const fetchPotentials = async (): Promise<
  Record<string, Record<string, SSPotential>>
> => {
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
