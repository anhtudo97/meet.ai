import { ChevronDownIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { CommandInput, CommandItem, CommandResponsiveDialog } from './ui/command';
import { CommandEmpty, CommandList } from 'cmdk';

interface CommandSelectProps {
  options: Array<{
    id: string;
    value: string;
    children: React.ReactNode;
  }>;
  onSelect: (value: string) => void;
  onSearch?: (query: string) => void;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

export const CommandSelect = ({ options, onSelect, onSearch, value, placeholder = "Select an option", isSearchable, className }: CommandSelectProps) => {

  const [open, setOpen] = useState(false);
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };
  const selectedOption = options.find(option => option.value === value);

  return (
    <>
      <Button
        type='button'
        variant={"outline"}
        className={
          cn(
            "h-9 justify-between font-normal px-2",
            !selectedOption && "text-muted-foreground",
            className
          )
        }
        onClick={() => setOpen(true)}
      >
        <div>
          {selectedOption?.children ?? placeholder}
          <ChevronDownIcon />
        </div>
      </Button>
      <CommandResponsiveDialog
        shouldFilter={!onSearch}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <CommandInput placeholder='Search...' onValueChange={onSearch} />
        <CommandList>
          <CommandEmpty>
            <span className='text-muted-foreground text-sm'>No results found.</span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
};
