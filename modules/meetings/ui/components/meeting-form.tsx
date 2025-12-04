import GeneratedAvatar from '@/components/generated-avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { meetingsInsertSchema } from '../../schema';
import { MeetingGetOne } from '../../types';
import { useState } from 'react';
import { CommandSelect } from '@/components/command-select';

interface MeetingFormProps {
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({ initialValues, onCancel, onSuccess }: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch
    })
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(`Failed to create agent: ${error.message}`);
      }
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));

        if (initialValues?.id) {
          await queryClient.invalidateQueries(trpc.meetings.getOne.queryOptions({ id: initialValues.id }));
        }
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(`Failed to create agent: ${error.message}`);
      }
    })
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      agentId: initialValues?.agentId ?? ''
    }
  });

  // Watch the name field
  const nameValue = useWatch({ control: form.control, name: 'name' });

  const isUpdate = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const submitForm = async (data: z.infer<typeof meetingsInsertSchema>) => {
    if (isUpdate) {
      await updateMeeting.mutateAsync({ id: initialValues!.id, ...data });
    } else {
      await createMeeting.mutateAsync(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className='space-y-4'>
        {/* <GeneratedAvatar seed={nameValue} variant='botttsNeutral' className='size-16' /> */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g 'Team Meeting'" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='agentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
                <CommandSelect
                  options={
                    (agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className='flex items-center gap-x-2'>
                          <GeneratedAvatar seed={agent.name} variant='botttsNeutral' className='size-6 border' />
                          <span>{agent.name}</span>
                        </div>
                      )
                    }))
                  }
                  onSelect={field.onChange}
                  onSearch={setAgentSearch}
                  value={field.value}
                  placeholder="Select an agent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-between gap-x-2'>
          {onCancel && (
            <Button onClick={onCancel} type='button' variant={'ghost'} disabled={isPending}>
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isPending}>
            {isUpdate ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
