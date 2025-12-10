import EmptyState from "./empty-state"

export const CancelledState = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center rounded-lg px-4 py-5 gap-4">
      <EmptyState
        image="/cancelled.svg"
        title="Meeting is Cancelled"
        description="Your meeting has been cancelled. You can reschedule it if needed."
      />
    </div>
  )
}
