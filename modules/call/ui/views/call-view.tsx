import ErrorState from "@/components/error-state"
import { useTRPC } from "@/trpc/client"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

interface CallViewProps {
  // Define any props if needed
  meetingId: string
}

export const CallView = ({ meetingId }: CallViewProps) => {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))

  if (data.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState title="Meeting Completed" description="The meeting you are trying to access has already ended." />
      </div>
    )
  }

  return <div>CallView</div>
}
