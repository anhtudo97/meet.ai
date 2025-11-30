'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { PropsWithChildren } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from './ui/drawer'

interface ResponsiveDialogProps extends PropsWithChildren {
  title: string
  description: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ResponsiveDialog = ({ title, description, open, onOpenChange, children }: ResponsiveDialogProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    // Mobile dialog implementation
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className='p-4'>{children}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
