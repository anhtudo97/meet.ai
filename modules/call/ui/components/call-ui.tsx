import { StreamTheme, useCall } from "@stream-io/video-react-sdk"
import React, { useState } from "react"
import { CallLobby } from "./call-lobby"
import { CallActive } from "./call-active"

interface CallUIProps {
  meetingName: string
}

export const CallUI = ({ meetingName }: CallUIProps) => {
  const call = useCall()
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby")

  const handleJoin = () => {
    if (!call) return

    call.join()
    setShow("call")
  }

  const handleLeave = () => {
    if (!call) return

    call.endCall()
    setShow("ended")
  }

  return (
    <StreamTheme className="h-full">
      {show}
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
      {show === "ended" && <p>Call Ended</p>}
    </StreamTheme>
  )
}
