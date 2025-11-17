"use client";

import { CommandInput, CommandDialog, CommandList, CommandItem } from '@/components/ui/command';
import { useSidebar } from '@/components/ui/sidebar';
import { Dispatch, SetStateAction } from 'react';

interface DashboardCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen} >
      <CommandInput
        placeholder='Type a command or search...'
      />
      <CommandList>
        <CommandItem>
          Test
        </CommandItem>
      </CommandList>
    </CommandDialog>
  );
};
