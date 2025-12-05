"use client"

import { DataTable } from "@/components/data-table"
import EmptyState from "@/components/empry-state"
import ErrorState from "@/components/error-state"
import LoadingState from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { columns } from "../components/columns"

export const MeetingsView = () => {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}))
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      {data.items.length > 0 && <DataTable data={data.items} columns={columns} />}
      {data.items.length === 0 && (
        <EmptyState title="No Meetings Found" description="There are no meetings available at the moment." />
      )}
    </div>
  )
}

export const MeetingsViewLoading = () => (
  <LoadingState title="Loading Meetings" description="Please wait while we load the meetings for you." />
)

export const MeetingsViewError = () => (
  <ErrorState
    title="Error Loading Meetings"
    description="There was an error loading the meetings. Please try again later."
  />
)
