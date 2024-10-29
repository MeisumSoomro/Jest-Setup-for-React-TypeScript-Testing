import { CheckCircle, Circle, PlayCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModuleProgressIndicatorProps {
  completed: boolean
  inProgress?: boolean
  size?: 'sm' | 'md'
}

export function ModuleProgressIndicator({ 
  completed, 
  inProgress,
  size = 'md' 
}: ModuleProgressIndicatorProps) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'

  if (completed) {
    return <CheckCircle className={cn(iconSize, "text-green-600")} />
  }

  if (inProgress) {
    return <PlayCircle className={cn(iconSize, "text-blue-600")} />
  }

  return <Circle className={cn(iconSize, "text-gray-300")} />
} 