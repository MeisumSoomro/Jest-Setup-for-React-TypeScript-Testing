import Link from 'next/link'
import { Module } from '@prisma/client'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ModuleNavigationProps {
  previousModule?: Module
  nextModule?: Module
  courseId: string
}

export function ModuleNavigation({ 
  previousModule, 
  nextModule,
  courseId
}: ModuleNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      {previousModule ? (
        <Button variant="outline" asChild>
          <Link href={`/modules/${previousModule.id}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            {previousModule.title}
          </Link>
        </Button>
      ) : (
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Link>
        </Button>
      )}

      {nextModule && (
        <Button asChild>
          <Link href={`/modules/${nextModule.id}`}>
            {nextModule.title}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  )
} 