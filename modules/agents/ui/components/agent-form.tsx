import GeneratedAvatar from "@/components/generated-avatar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTRPC } from "@/trpc/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { agentsInsertSchema } from "../../schema"
import { AgentGetOne } from "../../types"

interface AgentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialValues?: AgentGetOne
}

export const AgentForm = ({ initialValues, onCancel, onSuccess }: AgentFormProps) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
        onSuccess?.()
      },
      onError: (error) => {
        toast.error(`Failed to create agent: ${error.message}`)
      }
    })
  )

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))

        if (initialValues?.id) {
          await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({ id: initialValues.id }))
        }
        onSuccess?.()
      },
      onError: (error) => {
        toast.error(`Failed to create agent: ${error.message}`)
      }
    })
  )

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? ""
    }
  })

  // Watch the name field
  const nameValue = useWatch({ control: form.control, name: "name" })

  const isUpdate = !!initialValues?.id
  const isPending = createAgent.isPending || updateAgent.isPending

  const submitForm = async (data: z.infer<typeof agentsInsertSchema>) => {
    if (isUpdate) {
      await updateAgent.mutateAsync({ id: initialValues!.id, ...data })
    } else {
      await createAgent.mutateAsync(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
        <GeneratedAvatar seed={nameValue} variant="botttsNeutral" className="size-16" />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g 'Alex D'" {...field} disabled={isPending} />
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
                <Textarea {...field} placeholder="e.g 'You are a helpful assistant.'" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-x-2">
          {onCancel && (
            <Button onClick={onCancel} type="button" variant={"ghost"} disabled={isPending}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isUpdate ? "Update Agent" : "Create Agent"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
