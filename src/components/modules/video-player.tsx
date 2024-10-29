import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactPlayer from 'react-player'
import { useCourseProgress } from '@/hooks/use-course-progress'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  moduleId: string
  initialProgress?: number
}

export function VideoPlayer({ url, moduleId, initialProgress }: VideoPlayerProps) {
  const router = useRouter()
  const playerRef = useRef<ReactPlayer>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const { updateProgress, updating } = useCourseProgress(moduleId)
  
  // Track progress every 5 seconds
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(async () => {
      const currentTime = playerRef.current?.getCurrentTime()
      if (currentTime) {
        await updateProgress(moduleId, false, currentTime)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying, moduleId, updateProgress])

  const handleReady = () => {
    setIsReady(true)
    if (initialProgress) {
      playerRef.current?.seekTo(initialProgress, 'seconds')
    }
  }

  const handleProgress = async ({ playedSeconds }: { playedSeconds: number }) => {
    // Mark as completed when 90% watched
    const duration = playerRef.current?.getDuration() || 0
    if (playedSeconds / duration > 0.9) {
      await updateProgress(moduleId, true, playedSeconds)
    }
  }

  const handleEnded = async () => {
    await updateProgress(moduleId, true)
    router.refresh()
  }

  return (
    <>
      <div className="relative aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          controls
          playing={isPlaying}
          onReady={handleReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onProgress={handleProgress}
          onEnded={handleEnded}
        />
        
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        
        {updating && (
          <div className="absolute top-2 right-2">
            <Button size="sm" disabled>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving progress...
            </Button>
          </div>
        )}
      </div>
    </>
  )
} 