import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import type { Potentials, Trekkers } from '@/types'
import { usePotentialStore, useTrekkerStore } from '@/lib/store'
import { MAX_LEVEL } from '@/lib/utils'

const initialData: Record<
  string,
  { characters: Trekkers; potentials: Potentials }
> = {
  Ventus: {
    characters: { main: 119, sub1: 133, sub2: 123 },
    potentials: {
      main: {
        511903: { id: 511903, rarity: 0, priority: 'Core' },
        511904: { id: 511904, rarity: 0, priority: 'Core' },
        511909: { id: 511909, rarity: 2, level: 6, priority: 'Core' },
        511908: { id: 511908, rarity: 2, level: 6, priority: 'Core' },
        511911: { id: 511911, rarity: 1, level: '1+', priority: 'Medium' },
        511907: { id: 511907, rarity: 2, level: '1+', priority: 'Optional' },
        511912: { id: 511912, rarity: 2, level: '1+', priority: 'Optional' },
      },
      sub1: {
        513323: { id: 513323, rarity: 0, priority: 'Core' },
        513324: { id: 513324, rarity: 0, priority: 'Core' },
        513331: { id: 513331, rarity: 2, level: 6, priority: 'Core' },
        513332: { id: 513332, rarity: 2, level: 6, priority: 'Core' },
        513330: { id: 513330, rarity: 1, level: '1+', priority: 'Medium' },
        513333: { id: 513333, rarity: 1, level: '1+', priority: 'Medium' },
        513329: { id: 513329, rarity: 2, level: '1+', priority: 'Optional' },
      },
      sub2: {
        512321: { id: 512321, rarity: 0, priority: 'Core' },
        512323: { id: 512323, rarity: 0, priority: 'Core' },
        512328: { id: 512328, rarity: 2, level: 6, priority: 'Core' },
        512330: { id: 512330, rarity: 1, level: 6, priority: 'Core' },
        512333: { id: 512333, rarity: 1, level: 6, priority: 'Core' },
        512326: { id: 512326, rarity: 1, level: '1+', priority: 'Optional' },
      },
    },
  },
  Ignis: {
    characters: {
      main: 134,
      sub1: 158, // Snowish Laru
      sub2: 126, // Flora
    },
    potentials: {
      main: {
        513403: { id: 513403, rarity: 0, priority: 'Core' },
        513404: { id: 513404, rarity: 0, priority: 'Core' },
        513442: { id: 513442, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        513443: { id: 513443, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        513413: { id: 513413, rarity: 1, level: MAX_LEVEL, priority: 'Core' },
        513412: { id: 513412, rarity: 2, level: MAX_LEVEL, priority: 'Medium' },
        513411: { id: 513411, rarity: 2, level: MAX_LEVEL, priority: 'Medium' },
        513408: { id: 513408, rarity: 2, level: 1, priority: 'Medium' },
      },
      sub1: {
        515821: { id: 515821, rarity: 0, priority: 'Core' },
        515822: { id: 515822, rarity: 0, priority: 'Core' },
        515833: { id: 515833, rarity: 1, level: MAX_LEVEL, priority: 'Core' },
        515831: { id: 515831, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        515843: { id: 515843, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        515825: { id: 515825, rarity: 1, level: MAX_LEVEL, priority: 'Medium' },
        515826: {
          id: 515826,
          rarity: 2,
          level: MAX_LEVEL,
          priority: 'Optional',
        },
      },
      sub2: {
        512621: { id: 512621, rarity: 0, priority: 'Core' },
        512622: { id: 512622, rarity: 0, priority: 'Core' },
        512641: { id: 512641, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        512631: { id: 512631, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        512625: { id: 512625, rarity: 2, level: MAX_LEVEL, priority: 'Medium' },
        512629: { id: 512629, rarity: 1, level: MAX_LEVEL, priority: 'Medium' },
        512627: { id: 512627, rarity: 1, level: MAX_LEVEL, priority: 'Medium' },
      },
    },
  },
  Lux: {
    characters: {
      main: 155,
      sub1: 107,
      sub2: 132,
    },
    potentials: {
      main: {
        515501: { id: 515501, rarity: 0, priority: 'Core' },
        515502: { id: 515502, rarity: 0, priority: 'Core' },
        515505: { id: 515505, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        515506: { id: 515506, rarity: 1, level: MAX_LEVEL, priority: 'Core' },
        515507: { id: 515507, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        515513: { id: 515513, rarity: 2, level: MAX_LEVEL, priority: 'Medium' },
        515512: { id: 515512, rarity: 2, level: '1+', priority: 'Optional' },
      },
      sub1: {
        510721: { id: 510721, rarity: 0, priority: 'Core' },
        510723: { id: 510723, rarity: 0, priority: 'Core' },
        510725: { id: 510725, rarity: 1, level: MAX_LEVEL, priority: 'Core' },
        510728: { id: 510728, rarity: 1, level: MAX_LEVEL, priority: 'Core' },
        510726: { id: 510726, rarity: 2, level: MAX_LEVEL, priority: 'Medium' },
        510731: { id: 510731, rarity: 2, level: '1+', priority: 'Optional' },
        510727: { id: 510727, rarity: 2, level: 1, priority: 'Optional' },
        510729: { id: 510729, rarity: 2, level: MAX_LEVEL, priority: 'Medium' },
      },
      sub2: {
        513221: { id: 513221, rarity: 0, priority: 'Core' },
        513224: { id: 513224, rarity: 0, priority: 'Core' },
        513230: { id: 513230, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        513233: { id: 513233, rarity: 1, level: MAX_LEVEL, priority: 'Core' },
        513229: {
          id: 513229,
          rarity: 2,
          level: MAX_LEVEL,
          priority: 'Optional',
        },
        513231: { id: 513231, rarity: 2, level: 1, priority: 'Optional' },
        513228: {
          id: 513228,
          rarity: 1,
          level: '1+',
          priority: 'Optional',
        },
      },
    },
  },
  Aqua: {
    characters: {
      main: 144,
      sub1: 127,
      sub2: 125,
    },
    potentials: {
      main: {
        514401: { id: 514401, rarity: 0, priority: 'Core' },
        514402: { id: 514402, rarity: 0, priority: 'Core' },
        514407: { id: 514407, rarity: 1, level: MAX_LEVEL, priority: 'Core' },
        514405: { id: 514405, rarity: 2, level: '1+', priority: 'Medium' },
        514406: { id: 514406, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        514413: { id: 514413, rarity: 1, level: MAX_LEVEL, priority: 'Medium' },
        514411: {
          id: 514411,
          rarity: 2,
          level: '1+',
          priority: 'Optional',
        },
      },
      sub1: {
        512721: { id: 512721, rarity: 0, priority: 'Core' },
        512723: { id: 512723, rarity: 0, priority: 'Core' },
        512729: { id: 512729, rarity: 1, level: MAX_LEVEL, priority: 'Core' },
        512733: { id: 512733, rarity: 1, level: MAX_LEVEL, priority: 'Core' },
        512725: { id: 512725, rarity: 1, level: MAX_LEVEL, priority: 'Medium' },
        512731: { id: 512731, rarity: 2, level: '1+', priority: 'Optional' },
        512741: { id: 512741, rarity: 2, level: '6', priority: 'Optional' },
        512728: { id: 512728, rarity: 2, level: '1+', priority: 'Optional' },
      },
      sub2: {
        512521: { id: 512521, rarity: 0, priority: 'Core' },
        512523: { id: 512523, rarity: 0, priority: 'Core' },
        512525: { id: 512525, rarity: 2, level: MAX_LEVEL, priority: 'Core' },
        512533: { id: 512533, rarity: 1, level: MAX_LEVEL, priority: 'Core' },
        512531: { id: 512531, rarity: 2, level: MAX_LEVEL, priority: 'Medium' },
      },
    },
  },
}

export function Presets() {
  const setPresets = (value: string) => {
    const build = initialData[value]
    useTrekkerStore.setState({ trekkers: build.characters })
    usePotentialStore.setState({ potentials: build.potentials })
  }
  return (
    <div>
      <Select onValueChange={setPresets}>
        <SelectTrigger
          className="w-[150px] text-xs tracking-tight"
          aria-label="select-presets"
        >
          <SelectValue placeholder="Select Presets" />
        </SelectTrigger>
        <SelectContent className="*:text-xs">
          <SelectGroup>
            <SelectLabel>Aqua Builds</SelectLabel>
            <SelectItem value="Aqua">Chitose AA</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Lux Builds</SelectLabel>
            <SelectItem value="Lux">Shia AA</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Ignis Builds</SelectLabel>
            <SelectItem value="Ignis">Fuyuka Maygii</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Ventus Builds</SelectLabel>
            <SelectItem value="Ventus">Nanoha + Nazuka</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
