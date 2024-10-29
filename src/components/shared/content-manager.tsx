'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from 'sonner';
import { 
  Folder, 
  File, 
  Image, 
  Video, 
  MoreVertical, 
  Upload, 
  Plus,
  Search,
  Grid,
  List
} from 'lucide-react';

interface ContentItem {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'image' | 'video';
  size?: number;
  url?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
}

interface ContentManagerProps {
  allowedTypes?: string[];
  maxFileSize?: number;
  onSelect?: (item: ContentItem) => void;
  multiple?: boolean;
}

export function ContentManager({
  allowedTypes = ['*'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  onSelect,
  multiple = false
}: ContentManagerProps) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [currentFolder]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content?folder=${currentFolder || ''}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (files: FileList) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        if (file.size > maxFileSize) {
          throw new Error(`File ${file.name} exceeds size limit`);
        }
        formData.append('files', file);
      });

      if (currentFolder) {
        formData.append('folderId', currentFolder);
      }

      const response = await fetch('/api/content/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const uploadedFiles = await response.json();
      setItems(prev => [...prev, ...uploadedFiles]);
      setShowUploadDialog(false);
      toast.success('Files uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      const response = await fetch('/api/content/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          parentId: currentFolder
        })
      });

      if (!response.ok) throw new Error('Failed to create folder');

      const newFolder = await response.json();
      setItems(prev => [...prev, newFolder]);
      toast.success('Folder created');
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        Array.from(selectedItems).map(id =>
          fetch(`/api/content/${id}`, { method: 'DELETE' })
        )
      );

      setItems(prev => prev.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
      toast.success('Items deleted successfully');
    } catch (error) {
      console.error('Failed to delete items:', error);
      toast.error('Failed to delete items');
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getItemIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'folder': return <Folder className="w-6 h-6" />;
      case 'image': return <Image className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      default: return <File className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button
            variant="outline"
            onClick={() => handleCreateFolder('New Folder')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button
            variant="ghost"
            onClick={() => setView(prev => prev === 'grid' ? 'list' : 'grid')}
          >
            {view === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <Button
          variant="ghost"
          disabled={!currentFolder}
          onClick={() => setCurrentFolder(null)}
        >
          Root
        </Button>
        {/* Add breadcrumb path here */}
      </div>

      {/* Content Grid/List */}
      <div className={`
        ${view === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-4 gap-4'
          : 'space-y-2'
        }
      `}>
        {filteredItems.map(item => (
          <Card
            key={item.id}
            className={`
              p-4 cursor-pointer hover:shadow-md transition
              ${selectedItems.has(item.id) ? 'ring-2 ring-primary' : ''}
            `}
            onClick={() => {
              if (item.type === 'folder') {
                setCurrentFolder(item.id);
              } else if (onSelect) {
                if (multiple) {
                  const newSelected = new Set(selectedItems);
                  if (newSelected.has(item.id)) {
                    newSelected.delete(item.id);
                  } else {
                    newSelected.add(item.id);
                  }
                  setSelectedItems(newSelected);
                } else {
                  onSelect(item);
                }
              }
            }}
          >
            <div className={`
              ${view === 'grid' 
                ? 'flex flex-col items-center text-center'
                : 'flex items-center gap-4'
              }
            `}>
              {getItemIcon(item.type)}
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                {view === 'list' && (
                  <p className="text-sm text-gray-500">
                    {item.size ? `${(item.size / 1024 / 1024).toFixed(2)} MB` : ''}
                    {' · '}
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
          <FileUpload
            accept={allowedTypes.join(',')}
            maxSize={maxFileSize}
            onUpload={handleUpload}
          />
        </div>
      </Dialog>

      {/* Selection Actions */}
      {selectedItems.size > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Selected
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedItems(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}