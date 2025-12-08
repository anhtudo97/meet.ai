"use client"

import ErrorState from "@/components/error-state"
import GeneratedAvatar from "@/components/generated-avatar"
import LoadingState from "@/components/loading-state"
import { Badge } from "@/components/ui/badge"
import { useConfirm } from "@/hooks/use-confirm"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { VideoIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { AgentsDetailViewHeader } from "../components/agent-detail-view-header"
import { UpdateAgentDialog } from "../components/update-agent-dialog"

interface AgentsDetailViewProps {
  agentId: string
}

export const AgentsDetailView = ({ agentId }: AgentsDetailViewProps) => {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false)
  const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }))

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
        router.push("/agents")
      },
      onError: (error) => {
        toast.error(`Failed to remove agent: ${error.message}`)
      }
    })
  )

  const [RemoveConfirmationDialog, confirmRemove] = useConfirm({
    title: "Confirm Agent Removal",
    description: `The following action will remove ${data.meetingsCount} associated meetings. Are you sure you want to proceed?`
  })

  const handleRemove = async () => {
    const confirmed = await confirmRemove()
    if (!confirmed) {
      return
    }
    await removeAgent.mutateAsync({ id: agentId })
  }

  return (
    <>
      <RemoveConfirmationDialog />
      <UpdateAgentDialog open={updateAgentDialogOpen} onOpenChange={setUpdateAgentDialogOpen} initialValues={data} />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <AgentsDetailViewHeader
          agentId={agentId}
          agentName={data?.name || "Agent Detail"}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemove}
        />
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-5 flex flex-col col-span-5 gap-y-2">
            <div className="flex items-center gap-x-3">
              <GeneratedAvatar variant="botttsNeutral" seed={data?.name || "Agent"} className="size-10" />
              <h2 className="text-2xl font-medium">{data?.name || "Agent Detail"}</h2>
              <Badge variant={"outline"} className="flex items-center gap-x-2 [&>svg]:size-4">
                <VideoIcon className="text-blue-700" />
                {data?.meetingsCount || 0} {data?.meetingsCount === 1 ? "Meeting" : "Meetings"}
              </Badge>
            </div>
            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-semibold">Instructions</p>
              <p className="text-neutral-800">{data?.instructions || "No instructions available."}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const AgentsDetailViewLoading = () => (
  <LoadingState title="Loading Agents" description="Please wait while we load the agents for you." />
)

export const AgentsDetailViewError = () => (
  <ErrorState
    title="Error Loading Agents"
    description="There was an error loading the agents. Please try again later."
  />
)
