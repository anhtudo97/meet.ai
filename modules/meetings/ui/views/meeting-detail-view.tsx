"use client"

import { ActiveState } from "@/components/active-state"
import { CancelledState } from "@/components/cancelled-state"
import ErrorState from "@/components/error-state"
import LoadingState from "@/components/loading-state"
import { UpcomingState } from "@/components/upcoming-state"
import { useConfirm } from "@/hooks/use-confirm"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { MeetingDetailViewHeader } from "../components/meeting-detail-view-header"
import { UpdateMeetingDialog } from "../components/update-meeting-dialog"
import { ProcessingState } from "@/components/processing-state"

interface MeetingDetailViewProps {
  meetingId: string
}

export const MeetingDetailView = ({ meetingId }: MeetingDetailViewProps) => {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false)
  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))

  const [RemoveConfirmationDialog, confirmRemove] = useConfirm({
    title: "Confirm Meeting Removal",
    description: `Are you sure you want to remove this meeting? This action cannot be undone.`
  })

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))
        router.push("/meetings")
      },
      onError: (error) => {
        toast.error(`Failed to remove meeting: ${error.message}`)
      }
    })
  )

  const handleRemove = async () => {
    const confirmed = await confirmRemove()
    if (!confirmed) {
      return
    }
    await removeMeeting.mutateAsync({ id: meetingId })
  }

  const isActive = data?.status === "active"
  const isUpcoming = data?.status === "upcoming"
  const isCompleted = data?.status === "completed"
  const isCancelled = data?.status === "cancelled"
  const isProcessing = data?.status === "processing"

  return (
    <>
      <RemoveConfirmationDialog />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingDetailViewHeader
          meetingId={meetingId}
          meetingName={data?.name ?? ""}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemove}
        />
        {isActive && <ActiveState meetingId={meetingId} />}
        {isCompleted && <div>Meeting has been completed.</div>}
        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isUpcoming && <UpcomingState meetingId={meetingId} onCancelMeeting={() => {}} isCancelling={false} />}
      </div>
    </>
  )
}

export const MeetingsDetailViewLoading = () => (
  <LoadingState title="Loading Meetings" description="Please wait while we load the meetings for you." />
)

export const MeetingsDetailViewError = () => (
  <ErrorState
    title="Error Loading Meetings"
    description="There was an error loading the meetings. Please try again later."
  />
)
