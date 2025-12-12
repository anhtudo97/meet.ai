import { StreamClient } from "@stream-io/node-sdk"

const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY
const secretKey = process.env.STREAM_VIDEO_SECRET_KEY

if (!apiKey) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_STREAM_VIDEO_API_KEY")
}
if (!secretKey) {
  throw new Error("Missing required environment variable: STREAM_VIDEO_SECRET_KEY")
}

export const streamVideo = new StreamClient(apiKey, secretKey)
