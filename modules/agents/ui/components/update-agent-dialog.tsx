import { ResponsiveDialog } from '@/components/responsive-dialog'
import { AgentForm } from './agents-form'
import { AgentGetOne } from '../../types'

interface UpdateAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues: AgentGetOne
}

export const UpdateAgentDialog = ({ onOpenChange, open, initialValues }: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title='Update Agent'
      description='Update the details of your agent to automate tasks and workflows.'
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => {
          onOpenChange(false)
        }}
        onCancel={() => {
          onOpenChange(false)
        }}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  )
}
