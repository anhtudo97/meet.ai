import GeneratedAvatar from "@/components/generated-avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDuration } from "@/lib/utils"
import { format } from "date-fns"
import { BookOpenTextIcon, ClockFadingIcon, FileTextIcon, FileVideoIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import Markdown from "react-markdown"
import { MeetingGetOne } from "../../types"

interface CompletedStateProps {
  data: MeetingGetOne
}

enum TAB_TRIGGERS {
  SUMMARY = "summary",
  TRANSCRIPT = "transcript",
  RECORDING = "recording",
  CHAT = "chat"
}

export const CompletedState = ({ data }: CompletedStateProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue={TAB_TRIGGERS.SUMMARY}>
        <div className="bg-white rounded-lg border px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-12">
              <TabsTrigger
                value={TAB_TRIGGERS.SUMMARY}
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground "
              >
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value={TAB_TRIGGERS.TRANSCRIPT}
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground "
              >
                <FileTextIcon />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value={TAB_TRIGGERS.RECORDING}
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground "
              >
                <FileVideoIcon />
                Recording
              </TabsTrigger>
              <TabsTrigger
                value={TAB_TRIGGERS.CHAT}
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground "
              >
                <SparklesIcon />
                Ask AI
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value={TAB_TRIGGERS.RECORDING}>
          <div className="bg-white rounded-lg border px-4 py-5">
            <video src={data.recordingUrl!} className="w-full rounded-lg" controls />
          </div>
        </TabsContent>
        <TabsContent value={TAB_TRIGGERS.SUMMARY}>
          <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
              <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
              <div className="flex gap-x-2 items-center">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 underline underline-offset-4 capitalize"
                >
                  <GeneratedAvatar variant="botttsNeutral" seed={data.agent.name} className="size-5" />
                  {data.agent.name}
                </Link>
                <p>{data.startedAt ? format(data.startedAt, "PPPp") : ""}</p>
              </div>
              <div className="flex gap-x-2 items-center">
                <SparklesIcon className="size-4" />
                <p>General summary</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
                <ClockFadingIcon className="text-blue-700" />
                {data.duration ? formatDuration(data.duration) : "N/A"}
              </Badge>
              <div>
                <Markdown
                  components={{
                    h1: (props) => <h1 className="text-2xl font-medium mb-6" {...props} />,
                    h2: (props) => <h2 className="text-xl font-medium mb-6" {...props} />,
                    h3: (props) => <h3 className="text-lg font-medium mb-6" {...props} />,
                    h4: (props) => <h4 className="text-base font-medium mb-6" {...props} />,
                    p: (props) => <p className="mb-6 leading-relaxed text-muted-foreground" {...props} />,
                    ul: (props) => <ul className="list-disc ml-6 mb-6 list-inside" {...props} />,
                    ol: (props) => <ol className="list-decimal ml-6 mb-6 list-inside" {...props} />,
                    li: (props) => <li className="mb-2" {...props} />,
                    strong: (props) => <strong className="font-semibold" {...props} />,
                    code: (props) => <code className="bg-muted px-1 py-0.5 rounded font-mono text-sm" {...props} />,
                    blockquote: (props) => (
                      <blockquote className="border-l-4 pl-4 italic text-muted-foreground mb-6" {...props} />
                    )
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
