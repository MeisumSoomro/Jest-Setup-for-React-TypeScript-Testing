import { Module } from '@prisma/client'
import { MarkdownPreview } from '@/components/shared/markdown-preview'

interface ModuleContentProps {
  module: Module
}

export function ModuleContent({ module }: ModuleContentProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{module.title}</h1>
      {module.content && (
        <div className="prose max-w-none">
          <MarkdownPreview content={module.content} />
        </div>
      )}
    </div>
  )
} 