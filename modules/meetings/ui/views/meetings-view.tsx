'use client'

import ErrorState from '@/components/error-state'
import LoadingState from '@/components/loading-state'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'

export const MeetingsView = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))
  return (
    <div>
      {data.items.map((meeting) => (
        <div key={meeting.id}>
          <h2>{meeting.name}</h2>
          <p>{meeting.status}</p>
        </div>
      ))}
    </div>
  )
}

export const MeetingsViewLoading = () => (
  <LoadingState title='Loading Meetings' description='Please wait while we load the meetings for you.' />
)

export const MeetingsViewError = () => (
  <ErrorState
    title='Error Loading Meetings'
    description='There was an error loading the meetings. Please try again later.'
  />
)
