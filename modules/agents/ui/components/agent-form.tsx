import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { AgentGetOne } from '../../types';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { agentsInsertSchema } from '../../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import GeneratedAvatar from '@/components/generated-avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentForm = ({ initialValues, onCancel, onSuccess }: AgentFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id })
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(`Failed to create agent: ${error.message}`);
      }
    }),
  );

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    }
  });

  // Watch the name field
  const nameValue = useWatch({ control: form.control, name: 'name' });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending;

  const submitForm = async (data: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      // Edit logic here
    } else {
      await createAgent.mutateAsync(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
        <GeneratedAvatar
          seed={nameValue}
          variant="botttsNeutral"
          className='border size-16'
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g 'Alex D'"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="e.g 'You are a helpful assistant.'"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-between gap-x-2'>
          {
            onCancel && (
              <Button onClick={onCancel} type='button' variant={'ghost'} disabled={isPending}>
                Cancel
              </Button>

            )
          }
          <Button type="submit" disabled={isPending}>
            {isEdit ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
