import Image from "next/image"

interface EmptyStateProps {
  title: string
  description: string
}

const EmptyState = ({ description, title }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/empty.svg" alt="Empty State" width={240} height={240} className="opacity-50" />
      <div className="flex flex-col gap-y-6 text-center max-w-md mx-auto">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default EmptyState
