import { useState } from 'react'
import { Module, ModuleProgress } from '@prisma/client'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { toast } from 'sonner'
import { ModuleCard } from './module-card'

interface ModulesListProps {
  modules: Module[]
  progress?: ModuleProgress[]
  currentModuleId?: string
  isOwner: boolean
  courseId: string
}

export function ModulesList({ 
  modules: initialModules, 
  progress = [],
  currentModuleId,
  isOwner, 
  courseId 
}: ModulesListProps) {
  const [modules, setModules] = useState(initialModules)
  const [isReordering, setIsReordering] = useState(false)

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !isOwner || isReordering) return

    const items = Array.from(modules)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update the order of items
    const updatedModules = items.map((item, index) => ({
      ...item,
      order: index + 1
    }))

    // Optimistically update the UI
    setModules(updatedModules)

    try {
      setIsReordering(true)
      const response = await fetch(`/api/courses/${courseId}/modules/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modules: updatedModules })
      })

      if (!response.ok) {
        throw new Error('Failed to reorder modules')
      }
    } catch (error) {
      // Revert to original order on error
      setModules(initialModules)
      toast.error('Failed to reorder modules')
    } finally {
      setIsReordering(false)
    }
  }

  const onDragStart = () => {
    // Optional: Add visual feedback when dragging starts
    document.body.style.cursor = 'grabbing'
  }

  const onDragUpdate = (update: any) => {
    // Optional: Add visual feedback during drag
    if (!update.destination) {
      document.body.style.cursor = 'not-allowed'
    } else {
      document.body.style.cursor = 'grabbing'
    }
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No modules yet</p>
      </div>
    )
  }

  return (
    <DragDropContext 
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
    >
      <Droppable droppableId="modules">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-4 ${snapshot.isDraggingOver ? 'bg-gray-50 rounded-lg p-4' : ''}`}
          >
            {modules.map((module, index) => (
              <Draggable
                key={module.id}
                draggableId={module.id}
                index={index}
                isDragDisabled={!isOwner || isReordering}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`transition-shadow ${
                      snapshot.isDragging ? 'shadow-lg' : ''
                    }`}
                  >
                    <ModuleCard
                      module={module}
                      progress={progress.find(p => p.moduleId === module.id)}
                      currentModuleId={currentModuleId}
                      dragHandle={provided.dragHandleProps}
                      isOwner={isOwner}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
} 