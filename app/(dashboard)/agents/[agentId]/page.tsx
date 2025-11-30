import { AgentsDetailView, AgentsDetailViewError, AgentsDetailViewLoading } from '@/modules/agents/ui/views/agents-detail-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface AgentPageProps {
  params: Promise<{ agentId: string; }>;
}

const AgentPage = async ({ params }: AgentPageProps) => {
  const { agentId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<AgentsDetailViewLoading />}>
        <ErrorBoundary fallback={<AgentsDetailViewError />}>
          <AgentsDetailView agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default AgentPage;