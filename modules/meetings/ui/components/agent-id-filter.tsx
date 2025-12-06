import { CommandSelect } from "@/components/command-select"
import GeneratedAvatar from "@/components/generated-avatar"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters()

  const trpc = useTRPC()

  const [agentSearch, setAgentSearch] = useState("")
  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch
    })
  )

  return (
    <CommandSelect
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="size-6 border" />
            <span>{agent.name}</span>
          </div>
        )
      }))}
      onSelect={(value) => setFilters({ agentId: value as string })}
      onSearch={setAgentSearch}
      value={filters.agentId ?? ""}
      placeholder="Select an agent"
    />
  )
}
