import { beforeEach } from 'vitest'
import { fetchData } from '@/utils/fetchData'

vi.mock('./fetchCharacters', () => ({ fetchCharacters: vi.fn() }))
vi.mock('./fetchPotentials', () => ({ fetchPotentials: vi.fn() }))

const mockCharacters = {
  '107': {
    id: 107,
    name: {
      EN: 'Tilia',
      KR: '틸리아',
      JP: 'ティリア',
      CN: '缇莉娅',
      TW: '緹莉婭',
    },
    star: 4,
    element: 'Lux',
    class: 'Support',
    attackType: 'Melee',
  },
}

const mockPotentials = {
  '107': {
    '510701': {
      id: 510701,
      type: 'main',
      rarity: 0,
      imgId: '10701_Potential_01',
      name: {
        EN: 'Shield Counter',
        KR: '신성 방패의 반격',
        JP: '守護者の資質',
        CN: '神圣盾反',
        TW: '神聖盾反',
      },
      briefDesc: {
        EN: 'When Tilia is immune to damage in Fortify Stance, increases her Counterattack DMG.',
        KR: '「가디언」 상태를 통해 피해에 면역되면 반격을 강화한다.',
        JP: '防御態勢を取ってダメージを無効にした後、反撃が強化される。',
        CN: '如果通过「戍卫」状态成功免疫伤害，强化反击。',
        TW: '若藉由「戍衛」狀態成功免疫傷害，將強化反擊。',
      },
    },
    '510702': {
      id: 510702,
      type: 'main',
      rarity: 0,
      imgId: '10701_Potential_02',
      name: {
        EN: 'Perfect Triangle Formation',
        KR: '삼위일체',
        JP: '絶対守護',
        CN: '绝对三角',
        TW: '絕對三角',
      },
      briefDesc: {
        EN: 'When Tilia is immune to DMG in Fortify Stance, she gains Aegis that grants immunity.',
        KR: '「가디언」 상태를 통해 피해에 면역되면 피해에 면역될 수 있는 「신성 방패」를 획득한다.',
        JP: '防御態勢を取ってダメージを無効にすると、ダメージ無効効果がある聖なる盾を獲得するようになる。',
        CN: '如果通过「戍卫」状态成功免疫伤害，获得可免疫伤害的「圣盾」。',
        TW: '若藉由「戍衛」狀態成功免疫傷害，可獲得能免疫傷害的「聖盾」。',
      },
    },
  },
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockCharacters),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockPotentials),
      }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('fetching character and potential data', () => {
  it('returns merged data from fetches and localStorage', async () => {
    const result = await fetchData()
    expect(result.characters).toEqual(mockCharacters)
    expect(result.potentials).toEqual(mockPotentials)
  })
})
