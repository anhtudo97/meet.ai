import { VideoIcon } from "lucide-react"
import Link from "next/link"
import EmptyState from "./empty-state"
import { Button } from "./ui/button"

interface ActiveStateProps {
  meetingId: string
}

export const ActiveState = ({ meetingId }: ActiveStateProps) => {
  return (
    <div className="bg-white flex flex-col items-center justify-center rounded-lg px-4 py-5 gap-4">
      <EmptyState
        image="/upcoming.svg"
        title="Meeting is Active!"
        description="Your meeting is currently active. You can start the meeting or cancel it if needed."
      />

      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center w-full">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Join meeting
          </Link>
        </Button>
      </div>
    </div>
  )
}
