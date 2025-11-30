"use client";

import ErrorState from '@/components/error-state';
import LoadingState from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AgentsDetailViewHeader } from '../components/agents-detail-view-header';
import GeneratedAvatar from '@/components/generated-avatar';
import { Badge } from '@/components/ui/badge';
import { VideoIcon } from 'lucide-react';

interface AgentsDetailViewProps {
  agentId: string;
}

export const AgentsDetailView = ({ agentId }: AgentsDetailViewProps) => {
  const trpc = useTRPC();
  const { data, isLoading, error } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));



  return (
    <div className='flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4'>
      <AgentsDetailViewHeader
        agentId={agentId}
        agentName={data?.name || 'Agent Detail'}
        onEdit={() => { }}
        onRemove={() => { }}
      />
      <div className="bg-white rounded-lg border">
        <div className='px-4 py-5 flex flex-col col-span-5'>
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar
              variant='botttsNeutral'
              seed={data?.name || 'Agent'}
              className='size-10'
            />
            <h2 className='text-2xl font-medium'>{data?.name || 'Agent Detail'}</h2>
          </div>
          <Badge
            variant={'outline'}
            className='flex items-center gap-x-2 [&>svg]:size-4'
          >
            <VideoIcon className='text-blue-700' />
            {data?.meetingsCount || 0} {data?.meetingsCount === 1 ? 'Meeting' : 'Meetings'}
          </Badge>
          <div className='flex flex-col gap-y-4'>
            <p className='text-lg font-semibold'>Instructions</p>
            <p className='text-neutral-800'>{data?.instructions || 'No instructions available.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AgentsDetailViewLoading = () => (
  <LoadingState
    title="Loading Agents"
    description="Please wait while we load the agents for you."
  />
);

export const AgentsDetailViewError = () => (
  <ErrorState
    title="Error Loading Agents"
    description="There was an error loading the agents. Please try again later."
  />
);
