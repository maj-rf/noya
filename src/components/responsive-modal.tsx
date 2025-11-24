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

export function ResponsiveModal(props: ResponsiveModalProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="h-[150px] w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
          {props.triggerTitle && isTrekker(props.triggerTitle) ? (
            <SSAvatar char={props.triggerTitle} />
          ) : (
            <span
              className={
                props.triggerTitle === 'Main' ? 'text-red-400' : 'text-blue-400'
              }
            >
              {props.triggerTitle}
            </span>
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
      <DrawerTrigger className="h-[150px] w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center ">
        {props.triggerTitle && isTrekker(props.triggerTitle) ? (
          <SSAvatar char={props.triggerTitle} />
        ) : (
          <span
            className={
              props.triggerTitle === 'Main' ? 'text-red-400' : 'text-blue-400'
            }
          >
            {props.triggerTitle}
          </span>
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
