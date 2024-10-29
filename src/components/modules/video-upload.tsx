import { useEffect, useState } from 'react'
import { Widget } from '@uploadcare/react-widget'
import { Button } from '../ui/button'

interface VideoUploadProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function VideoUpload({ value, onChange, disabled }: VideoUploadProps) {
  const [preview, setPreview] = useState(value)

  useEffect(() => {
    setPreview(value)
  }, [value])

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative aspect-video">
          <video 
            src={preview} 
            controls 
            className="w-full rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => {
              onChange('')
              setPreview('')
            }}
            disabled={disabled}
          >
            Remove
          </Button>
        </div>
      ) : (
        <Widget
          publicKey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
          onChange={(file) => {
            if (file) {
              onChange(file.cdnUrl)
              setPreview(file.cdnUrl)
            }
          }}
          disabled={disabled}
          tabs="file camera url"
          previewStep
          clearable
          validators={[
            {
              name: 'videoOnly',
              fn: (fileInfo) => {
                const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg']
                if (!allowedTypes.includes(fileInfo.mimeType)) {
                  throw new Error('Only video files are allowed')
                }
                return true
              }
            }
          ]}
        />
      )}
    </div>
  )
} 