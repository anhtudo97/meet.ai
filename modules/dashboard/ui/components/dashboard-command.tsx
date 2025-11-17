"use client";

import { CommandDialog, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
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
