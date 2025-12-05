import { botttsNeutral, initials } from "@dicebear/collection"
import { createAvatar } from "@dicebear/core"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "./ui/avatar"
import { cn } from "@/lib/utils"

interface GeneratedAvatarProps {
  // Define any props if needed
  seed: string
  className?: string
  variant?: "botttsNeutral" | "initials"
}

const GeneratedAvatar = ({ seed, className, variant }: GeneratedAvatarProps) => {
  let avatar

  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed
    })
  } else {
    avatar = createAvatar(initials, {
      seed: seed,
      size: 40,
      radius: 50
    })
  }

  return (
    <Avatar className={cn("block [&>img]:rounded-full", className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Generated Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export default GeneratedAvatar
