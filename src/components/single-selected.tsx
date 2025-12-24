import { InfoIcon, X } from 'lucide-react'
import { Slider } from './ui/slider'
import { Button } from './ui/button'
import {
    HybridTooltip,
    HybridTooltipContent,
    HybridTooltipTrigger,
} from './ui/hybrid-tooltip'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'
import type { PotentialPriority, Slot } from '@/types'
import { useTrekkerStore } from '@/lib/trekker-store'
import ResponsivePotential from './responsive-potential'

export function SingleSelected({ slot, id }: { slot: Slot; id: number }) {
    const s = useTrekkerStore((state) => state.potentials[slot][id])
    const updateLevel = useTrekkerStore((sel) => sel.updateLevel)
    const removePotential = useTrekkerStore((sel) => sel.removePotential)
    const updatePriority = useTrekkerStore((sel) => sel.updatePriority)

    if (!s) return null

    return (
        <div className="flex flex-col gap-2 justify-center">
            <HybridTooltip>
                <HybridTooltipTrigger asChild>
                    <div className="relative">
                        <ResponsivePotential
                            key={'selected' + s.imgId + s.id}
                            rarity={s.rarity}
                            imgId={s.imgId}
                            name={s.name}
                            subIcon={s.subIcon}
                        />
                        {s.rarity !== 0 && (
                            <div className="absolute -top-px left-3 text-xs font-semibold text-indigo-500">
                                {s.level}
                            </div>
                        )}

                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-1 -right-1 rounded-full size-4 border border-white"
                            onClick={() => removePotential(slot, s.id)}
                        >
                            <X className="size-3" />
                        </Button>
                    </div>
                </HybridTooltipTrigger>
                <HybridTooltipContent>
                    <p>{s.briefDesc}</p>
                </HybridTooltipContent>
            </HybridTooltip>

            <div className="w-20 space-y-2">
                <Slider
                    defaultValue={[s.level || 1]}
                    step={1}
                    disabled={s.rarity === 0}
                    min={1}
                    max={6}
                    onValueChange={(newValue: Array<number>) =>
                        updateLevel(slot, s.id, newValue[0])
                    }
                ></Slider>
                <Select
                    disabled={s.rarity === 0}
                    value={s.priority}
                    onValueChange={(value) =>
                        updatePriority(slot, id, value as PotentialPriority)
                    }
                >
                    <SelectTrigger className="text-[10px] w-full px-2" size="sm">
                        <SelectValue placeholder="PotentialPriority" />
                    </SelectTrigger>
                    <SelectContent align="start">
                        <SelectItem className="text-[10px]" value="Core">
                            Core
                        </SelectItem>
                        <SelectItem className="text-[10px]" value="Medium">
                            Medium
                        </SelectItem>
                        <SelectItem className="text-[10px]" value="Optional">
                            Optional
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
