export type SSPotential = {
  name: string
  briefDesc: string
  type: 'main' | 'common' | 'support'
  rarity: 0 | 1 | 2
  imgId: string
  id: number
  subIcon?: 'Diamond' | 'Common' | 'Round'
}

export type SSCharacter = {
  id: number
  name: string
  star: number
  element: string
  class: string
  attackType: string
  tag: Array<string>
}

export type Slot = 'main' | 'sub1' | 'sub2'

export type Trekkers = Record<Slot, number | null>

export type PotentialPriority = 'Core' | 'Medium' | 'Optional'

export type SelectedPotential =
  | (Pick<SSPotential, 'id'> & {
      rarity: 0
      level?: never
      priority: Extract<PotentialPriority, 'Core'>
    })
  | (Pick<SSPotential, 'id'> & {
      rarity: 1 | 2
      level: number | string
      priority: PotentialPriority
    })

type SelectedPotentialMap = Record<string, SelectedPotential>

export type Potentials = Record<Slot, SelectedPotentialMap>

export type BuildMap = Record<
  string,
  {
    id: string
    name: string
    trekkers: Trekkers
    potentials: Potentials
  }
>
