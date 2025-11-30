'use client'

import { CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from '@/components/ui/command'
import { Dispatch, SetStateAction } from 'react'

interface DashboardCommandProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <CommandItem>Test</CommandItem>
      </CommandList>
    </CommandResponsiveDialog>
  )
}
