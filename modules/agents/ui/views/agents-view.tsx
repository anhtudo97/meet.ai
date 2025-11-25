"use client";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import EmptyState from "@/components/empry-state";

export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({}));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      {/* {
        JSON.stringify(data, null, 2)
      } */}
      <DataTable
        data={data.items}
        columns={columns}
      />
      {
        data.items.length === 0 && (
          <EmptyState
            title="No Agents Found"
            description="There are no agents available at the moment."
          />
        )
      }
    </div>
  );
};

export const AgentsViewLoading = () => (
  <LoadingState
    title="Loading Agents"
    description="Please wait while we load the agents for you."
  />
);

export const AgentsViewError = () => (
  <ErrorState
    title="Error Loading Agents"
    description="There was an error loading the agents. Please try again later."
  />
);

