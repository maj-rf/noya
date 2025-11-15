import { useState } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { SSAvatar } from './ss-avatar'
import type { TAvatar } from '@/types'
import useMediaQuery from '@/lib/useMediaQuery'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

type ResponsiveModalProps = {
  triggerTitle: string | TAvatar
  title: string
  desc: string
  children: React.ReactNode
}

function isTrekker(char: any): char is TAvatar {
  if (typeof char === 'string') return false
  return 'star' in char
}

// TODO: set height to Trigger

export function ResponsiveModal(props: ResponsiveModalProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="h-[161px] w-[116px] bg-accent border rounded-xl shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out ">
          {props.triggerTitle && isTrekker(props.triggerTitle) ? (
            <SSAvatar char={props.triggerTitle} />
          ) : (
            props.triggerTitle
          )}
        </DialogTrigger>
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.desc}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-100 px-2">{props.children}</ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="h-[161px] w-[116px] bg-accent border rounded-xl shadow-sm flex items-center justify-center ">
        {props.triggerTitle && isTrekker(props.triggerTitle) ? (
          <SSAvatar char={props.triggerTitle} />
        ) : (
          props.triggerTitle
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.desc}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-100 px-2">{props.children}</ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
