import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
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
        <DialogTrigger className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
          {props.triggerTitle && isTrekker(props.triggerTitle) ? (
            <SSAvatar char={props.triggerTitle} />
          ) : (
            <>
              <PlusIcon size={16} />
              <span>{props.triggerTitle}</span>
            </>
          )}
        </DialogTrigger>
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.desc}</DialogDescription>
          </DialogHeader>
          {props.children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="h-[125px] w-[100px] md:h-[150px] md:w-[120px] aspect-[0.8] bg-accent border rounded-sm shadow-sm flex items-center justify-center ">
        {props.triggerTitle && isTrekker(props.triggerTitle) ? (
          <SSAvatar char={props.triggerTitle} />
        ) : (
          <>
            <PlusIcon size={16} />
            <span>{props.triggerTitle}</span>
          </>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.desc}</DrawerDescription>
        </DrawerHeader>
        {props.children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
