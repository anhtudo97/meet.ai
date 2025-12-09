import { BanIcon, VideoIcon } from "lucide-react"
import EmptyState from "./empty-state"
import { Button } from "./ui/button"
import Link from "next/link"

interface UpcomingStateProps {
  meetingId: string
  onCancelMeeting: () => void
  isCancelling: boolean
}

export const UpcomingState = ({ meetingId, onCancelMeeting, isCancelling }: UpcomingStateProps) => {
  return (
    <div className="bg-white flex flex-col items-center justify-center rounded-lg px-4 py-5 gap-4">
      <EmptyState
        image="/upcoming.svg"
        title="Upcoming Features Coming Soon!"
        description="We're working hard to bring you new and exciting features. Stay tuned for updates!"
      />

      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button variant={"secondary"} className="w-full lg:w-auto" onClick={onCancelMeeting} disabled={isCancelling}>
          <BanIcon />
          Cancel meeting
        </Button>
        <Button asChild disabled={isCancelling} className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  )
}
