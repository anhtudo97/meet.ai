import EmptyState from "./empty-state"

export const ProcessingState = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center rounded-lg px-4 py-5 gap-4">
      <EmptyState
        image="/processing.svg"
        title="Meeting is Processing"
        description="Your meeting is currently being processed. Please wait."
      />
    </div>
  )
}
