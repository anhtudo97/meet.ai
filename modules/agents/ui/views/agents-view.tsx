"use client"

import ErrorState from "@/components/error-state"
import LoadingState from "@/components/loading-state"
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { columns } from "../components/columns"
import EmptyState from "@/components/empty-state"
import { useAgentsFilters } from "../../hooks/use-agents-filters"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { DataPagination } from "@/components/data-pagination"

export const AgentsView = () => {
  const router = useRouter()
  const [filters, setFilters] = useAgentsFilters()
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({ ...filters }))

  const handleRowClick = (row: (typeof data.items)[number]) => {
    router.push(`/agents/${row.id}`)
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
        <EmptyState title="No Agents Found" description="There are no agents available at the moment." />
      )}
    </div>
  )
}

export const AgentsViewLoading = () => (
  <LoadingState title="Loading Agents" description="Please wait while we load the agents for you." />
)

export const AgentsViewError = () => (
  <ErrorState
    title="Error Loading Agents"
    description="There was an error loading the agents. Please try again later."
  />
)
