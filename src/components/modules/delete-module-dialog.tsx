import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'

interface DeleteModuleDialogProps {
  moduleId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteModuleDialog({
  moduleId,
  open,
  onOpenChange
}: DeleteModuleDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete module')

      toast.success('Module deleted successfully')
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Module</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this module? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-x-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 