import { ResponsiveDialog } from '@/components/responsive-dialog'
import { MeetingGetOne } from '../../types'
import { MeetingForm } from './meeting-form'

interface UpdateMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues: MeetingGetOne
}

export const UpdateMeetingDialog = ({ onOpenChange, open, initialValues }: UpdateMeetingDialogProps) => {
  return (
    <ResponsiveDialog
      title='Update Meeting'
      description='Update the details of your meeting to manage your events effectively.'
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
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
