import { useState } from 'react'
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
  triggerTitle: string
  title: string
  desc: string
  children?: React.ReactNode
}

export function ResponsiveModal(props: ResponsiveModalProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="shadow-sm  active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
            <span>{props.triggerTitle}</span>
          </Button>
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
    <Drawer open={open} onOpenChange={setOpen} repositionInputs={false}>
      <DrawerTrigger asChild>
        <Button className="shadow-sm  active:scale-[0.98] active:shadow-inner duration-150 ease-in-out">
          <span>{props.triggerTitle}</span>
        </Button>
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
