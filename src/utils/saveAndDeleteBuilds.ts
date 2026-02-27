import type { BuildMap } from '@/types'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'

export function saveToLocal(id: string, name: string | undefined) {
  if (!name) return
  const potentials = usePotentialStore.getState().potentials
  const trekkers = useTrekkerStore.getState().trekkers
  if (!trekkers.main) return
  const buildsJSON = localStorage.getItem('saved-builds')
  const builds: BuildMap = buildsJSON ? JSON.parse(buildsJSON) : {}
  builds[id] = { id, trekkers, potentials, name }
  localStorage.setItem('saved-builds', JSON.stringify(builds))
}

export function deleteBuild(id: string) {
  const buildsJSON = localStorage.getItem('saved-builds')
  const builds: BuildMap = buildsJSON ? JSON.parse(buildsJSON) : {}
  if (Object.keys(builds).includes(id)) {
    delete builds[id]
    localStorage.setItem('saved-builds', JSON.stringify(builds))
  }
  return
}
