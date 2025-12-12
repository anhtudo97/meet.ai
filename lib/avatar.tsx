import { createAvatar } from "@dicebear/core"
import { botttsNeutral, initials } from "@dicebear/collection"

interface Props {
  seed: string
  variant?: "botttsNeutral" | "initials"
}

export const generatedAvatarUri = ({ seed, variant }: Props) => {
  let avatar

  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed
    })
  } else {
    avatar = createAvatar(initials, {
      seed,
      size: 42,
      fontWeight: 500,
      radius: 50
    })
  }

  return avatar.toDataUri()
}
