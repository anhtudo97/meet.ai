import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { generatedAvatarUri } from "@/lib/avatar"
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview
} from "@stream-io/video-react-sdk"
import { LogInIcon } from "lucide-react"
import Link from "next/link"

interface CallLobbyProps {
  onJoin: () => void
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession()

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          image:
            data?.user.image ??
            generatedAvatarUri({
              seed: data?.user.name ?? "",
              variant: "initials"
            })
        } as StreamVideoParticipant
      }
    />
  )
}

const AllowBrowserPermission = () => {
  return <p className="text-sm">Please allow your browser to access your microphone and camera.</p>
}

export const CallLobby = ({ onJoin }: CallLobbyProps) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks()

  const { hasBrowserPermission: hasMicrophonePermission } = useMicrophoneState()
  const { hasBrowserPermission: hasCameraPermission } = useCameraState()

  const hasBrowserMediaPermission = hasMicrophonePermission && hasCameraPermission
  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready for join?</h6>
            <p className="text-sm">Please ensure your microphone and camera are enabled.</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={hasBrowserMediaPermission ? DisabledVideoPreview : AllowBrowserPermission}
          />
          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className="flex gap-x-2 justify-between w-full">
            <Button asChild variant="ghost">
              <Link href="/meetings">Cancel</Link>
            </Button>
            <Button disabled={!hasBrowserMediaPermission} onClick={onJoin}>
              <LogInIcon />
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
