import { createContext, useContext, useEffect, useState } from 'react'
import { PopoverArrow } from '@radix-ui/react-popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import type {
  PopoverContentProps,
  PopoverProps,
  PopoverTriggerProps,
} from '@radix-ui/react-popover'
import type {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from '@radix-ui/react-tooltip'
import type { PropsWithChildren } from 'react'
import useMediaQuery from '@/lib/useMediaQuery'

const TouchContext = createContext<boolean | undefined>(undefined)
const useTouch = () => useContext(TouchContext)

const TouchProvider = (props: PropsWithChildren) => {
  const isMobile = useMediaQuery('(max-width: 480px)')

  return <TouchContext.Provider value={isMobile} {...props} />
}

const HybridTooltipProvider = (props: TooltipProviderProps) => {
  return <TooltipProvider delayDuration={0} {...props} />
}

const HybridTooltip = (props: TooltipProps & PopoverProps) => {
  const isMobile = useTouch()

  return isMobile ? <Popover {...props} /> : <Tooltip {...props} />
}

const HybridTooltipTrigger = (
  props: TooltipTriggerProps & PopoverTriggerProps,
) => {
  const isMobile = useTouch()

  return isMobile ? (
    <PopoverTrigger {...props} />
  ) : (
    <TooltipTrigger {...props} />
  )
}

const HybridTooltipContent = (
  props: PropsWithChildren<TooltipContentProps & PopoverContentProps>,
) => {
  const isMobile = useTouch()

  return isMobile ? (
    <PopoverContent
      className="bg-foreground text-background p-2 text-xs"
      {...props}
      side="top"
      sideOffset={0}
    >
      <PopoverArrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]" />
      {props.children}
    </PopoverContent>
  ) : (
    <TooltipContent {...props} />
  )
}

export {
  TouchProvider,
  HybridTooltipProvider,
  HybridTooltip,
  HybridTooltipTrigger,
  HybridTooltipContent,
}
