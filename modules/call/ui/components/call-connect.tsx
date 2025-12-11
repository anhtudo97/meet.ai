"use client"

import { useTRPC } from "@/trpc/client"
import { Call, CallingState, StreamCall, StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk"
import "@stream-io/video-react-sdk/dist/css/styles.css"
import { useMutation } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { use, useEffect, useMemo, useState } from "react"
import { CallUI } from "./call-ui"

interface CallConnectProps {
  meetingId: string
  meetingName: string
  userId: string
  userName: string
  userImage: string
}

export const CallConnect = ({ meetingId, meetingName, userId, userName, userImage }: CallConnectProps) => {
  const trpc = useTRPC()
  const { mutateAsync: generateToken } = useMutation(trpc.meetings.generateToken.mutationOptions())

  const client = useMemo(() => {
    return StreamVideoClient.getOrCreateInstance({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage
      },
      tokenProvider: generateToken
    })
  }, [userId, userName, userImage, generateToken])

  const call = useMemo(() => {
    if (!client) return null
    const _call = client.call("default", meetingId)
    _call.camera.disable()
    _call.microphone.disable()
    return _call
  }, [client, meetingId])

  useEffect(() => {
    console.log("Call state changed", client, call)
    return () => {
      if (call?.state.callingState !== CallingState.LEFT) {
        call?.leave()
        call?.endCall()
      }

      client.disconnectUser()
    }
  }, [client, call])

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <Loader2Icon className="size-6 animate-spin text-white" />
      </div>
    )
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  )
}
