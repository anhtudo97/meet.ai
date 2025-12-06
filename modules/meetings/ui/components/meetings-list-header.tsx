"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { NewMeetingDialog } from "./new-meeting-dialog"
import { MeetingsSearchFilter } from "./meetings-search-filter"
import { StatusFilter } from "./status-filter"
import { AgentIdFilter } from "./agent-id-filter"
import { useMeetingsFilters } from "../../hooks/use-meetings-filters"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DEFAULT_PAGE } from "@/constant"

export const MeetingsListHeader = () => {
  const [filters, setFilters] = useMeetingsFilters()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
  }

  const onClearFilters = () => {
    setFilters({
      search: "",
      status: undefined,
      agentId: "",
      page: DEFAULT_PAGE
    })
  }

  const isAnyFilterApplied = Boolean(!!filters.search || !!filters.status || !!filters.agentId)

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={handleOpenChange} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Meetings</h5>
          <Button variant="default" onClick={() => handleOpenChange(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterApplied && (
              <Button variant="outline" onClick={onClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  )
}
