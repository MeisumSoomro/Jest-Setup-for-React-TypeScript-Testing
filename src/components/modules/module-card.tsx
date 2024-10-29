import { useState } from 'react'
import Link from 'next/link'
import { Module, ModuleProgress } from '@prisma/client'
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import { GripVertical, Pencil, Trash } from 'lucide-react'
import { Button } from '../ui/button'
import { EditModuleDialog } from './edit-module-dialog'
import { DeleteModuleDialog } from './delete-module-dialog'
import { ModuleProgressIndicator } from './module-progress-indicator'
import { cn } from '@/lib/utils'

interface ModuleCardProps {
  module: Module
  progress?: ModuleProgress
  currentModuleId?: string
  dragHandle?: DraggableProvidedDragHandleProps
  isOwner: boolean
}

export function ModuleCard({ 
  module, 
  progress,
  currentModuleId,
  dragHandle, 
  isOwner 
}: ModuleCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const isCurrentModule = currentModuleId === module.id
  const completed = progress?.completed || false

  return (
    <>
      <div 
        className={cn(
          "bg-white border rounded-lg p-4 transition-all duration-200",
          isCurrentModule && "border-blue-500 shadow-sm",
          dragHandle && "hover:border-gray-300"
        )}
      >
        <div className="flex items-center gap-x-2">
          {isOwner && dragHandle && (
            <div 
              {...dragHandle} 
              className="cursor-grab active:cursor-grabbing"
              onMouseEnter={(e) => {
                e.currentTarget.style.cursor = 'grab'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.cursor = 'default'
              }}
            >
              <GripVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </div>
          )}
          
          {!isOwner && (
            <ModuleProgressIndicator 
              completed={completed}
              inProgress={isCurrentModule}
            />
          )}

          <div className="flex-1">
            <Link 
              href={`/modules/${module.id}`}
              className="text-lg font-semibold hover:underline"
            >
              {module.title}
            </Link>
            {module.content && (
              <p className="text-sm text-gray-500 mt-1">
                {module.content}
              </p>
            )}
            {progress?.lastPosition && !completed && (
              <p className="text-xs text-blue-600 mt-1">
                Continue watching from {formatTime(progress.lastPosition)}
              </p>
            )}
          </div>

          {isOwner && (
            <div className="flex items-center gap-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <EditModuleDialog
        module={module}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      
      <DeleteModuleDialog
        moduleId={module.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}