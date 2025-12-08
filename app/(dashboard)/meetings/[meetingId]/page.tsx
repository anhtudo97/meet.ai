import {
  MeetingDetailView,
  MeetingsDetailViewError,
  MeetingsDetailViewLoading
} from "@/modules/meetings/ui/views/meeting-detail-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface AgentPageProps {
  params: Promise<{ agentId: string }>
}

export const Page = async ({ params }: AgentPageProps) => {
  const { agentId } = await params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({ id: agentId }))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MeetingsDetailViewLoading />}>
        <ErrorBoundary fallback={<MeetingsDetailViewError />}>
          <MeetingDetailView meetingId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page
