import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

interface GroupPostsProps {
  groupId: string
}

export function GroupPosts({ groupId }: GroupPostsProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, groupId })
      })

      if (!response.ok) throw new Error('Failed to create post')

      setContent('')
      toast.success('Post created!')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
          disabled={loading}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </form>
      {/* Posts list will be implemented here */}
    </div>
  )
} 