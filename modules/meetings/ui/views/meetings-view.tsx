"use client"

import { DataTable } from "@/components/data-table"
import EmptyState from "@/components/empty-state"
import ErrorState from "@/components/error-state"
import LoadingState from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { columns } from "../components/columns"
import { DataPagination } from "@/components/data-pagination"

export const MeetingsView = () => {
  const router = useRouter()
  const [filters, setFilters] = useMeetingsFilters()
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({ ...filters }))

  const handleRowClick = (row: (typeof data.items)[number]) => {
    router.push(`/meetings/${row.id}`)
  }

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      {data.items.length > 0 && (
        <>
          <DataTable data={data.items} columns={columns} onRowClick={handleRowClick} />
          <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </>
      )}
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
