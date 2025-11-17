export type SSPotential = {
  name: string
  briefDesc: string
  type: 'main' | 'common' | 'support'
  rarity: 0 | 1 | 2
  imgId: string
  id: number
}

export type SSCharacter = {
  id: number
  name: string
  star: number
  element: string
  class: string
  attackType: string
  tag: Array<string>
  potential: Array<SSPotential>
}

export type TAvatar = Omit<SSCharacter, 'potential'>

export type Trekkers = {
  main: null | SSCharacter
  sub1: null | SSCharacter
  sub2: null | SSCharacter
}

export type SelectedPotential =
  | (SSPotential & { rarity: 0; level?: never })
  | (SSPotential & { rarity: 1 | 2; level: number })
