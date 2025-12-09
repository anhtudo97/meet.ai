import {
  MeetingDetailView,
  MeetingsDetailViewError,
  MeetingsDetailViewLoading
} from "@/modules/meetings/ui/views/meeting-detail-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface MeetingDetailPageProps {
  params: Promise<{ meetingId: string }>
}

export const Page = async ({ params }: MeetingDetailPageProps) => {
  const { meetingId } = await params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsDetailViewLoading />}>
        <ErrorBoundary fallback={<MeetingsDetailViewError />}>
          <MeetingDetailView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page
