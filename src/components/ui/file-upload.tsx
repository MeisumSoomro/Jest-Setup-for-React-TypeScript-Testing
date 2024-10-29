'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Progress } from './progress';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onUpload: (files: FileList) => Promise<void>;
}

export function FileUpload({ accept, maxSize, onUpload }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    multiple: true
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const fileList = Object.assign(new DataTransfer().files, files);
      await onUpload(fileList);
      setFiles([]);
      setProgress(100);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop files here, or click to select files
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => (
            <div
              key={file.name}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-sm truncate">{file.name}</span>
              <button
                onClick={() => setFiles(files.filter(f => f !== file))}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div className="space-y-2">
            {uploading && <Progress value={progress} />}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 