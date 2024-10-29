'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { useSocket } from '@/lib/socket';
import { formatDistanceToNow } from 'date-fns';

interface Discussion {
  id: string;
  title: string;
  content: string;
  userId: string;
  user: {
    name: string;
    image: string;
  };
  createdAt: Date;
  replies: Reply[];
}

interface Reply {
  id: string;
  content: string;
  userId: string;
  user: {
    name: string;
    image: string;
  };
  createdAt: Date;
}

export default function DiscussionsPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchDiscussions();
    
    if (socket) {
      socket.on('new_discussion', handleNewDiscussion);
      socket.on('new_reply', handleNewReply);
    }

    return () => {
      if (socket) {
        socket.off('new_discussion');
        socket.off('new_reply');
      }
    };
  }, [socket, groupId]);

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/discussions`);
      const data = await response.json();
      setDiscussions(data);
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
    }
  };

  const handleNewDiscussion = (discussion: Discussion) => {
    setDiscussions(prev => [discussion, ...prev]);
  };

  const handleNewReply = (reply: Reply) => {
    if (selectedDiscussion && reply.discussionId === selectedDiscussion.id) {
      setSelectedDiscussion(prev => ({
        ...prev!,
        replies: [...prev!.replies, reply]
      }));
    }
  };

  const createDiscussion = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDiscussion)
      });

      if (!response.ok) throw new Error('Failed to create discussion');

      const discussion = await response.json();
      setDiscussions(prev => [discussion, ...prev]);
      setNewDiscussion({ title: '', content: '' });
    } catch (error) {
      console.error('Failed to create discussion:', error);
    }
  };

  const createReply = async () => {
    if (!selectedDiscussion) return;

    try {
      const response = await fetch(`/api/groups/${groupId}/discussions/${selectedDiscussion.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent })
      });

      if (!response.ok) throw new Error('Failed to create reply');

      const reply = await response.json();
      setSelectedDiscussion(prev => ({
        ...prev!,
        replies: [...prev!.replies, reply]
      }));
      setReplyContent('');
    } catch (error) {
      console.error('Failed to create reply:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Create Discussion Form */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Start a Discussion</h2>
        <div className="space-y-4">
          <Input
            placeholder="Discussion Title"
            value={newDiscussion.title}
            onChange={e => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
          />
          <Textarea
            placeholder="What would you like to discuss?"
            value={newDiscussion.content}
            onChange={e => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
            rows={4}
          />
          <Button onClick={createDiscussion}>Post Discussion</Button>
        </div>
      </Card>

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.map(discussion => (
          <Card
            key={discussion.id}
            className="p-6 cursor-pointer hover:shadow-md transition"
            onClick={() => setSelectedDiscussion(discussion)}
          >
            <div className="flex items-start gap-4">
              <Avatar src={discussion.user.image} alt={discussion.user.name} />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{discussion.title}</h3>
                <p className="text-gray-600 mt-2">{discussion.content}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>{discussion.user.name}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(discussion.createdAt))} ago</span>
                  <span>•</span>
                  <span>{discussion.replies.length} replies</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Discussion Detail Modal */}
      {selectedDiscussion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">{selectedDiscussion.title}</h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDiscussion(null)}
                >
                  ×
                </Button>
              </div>

              <div className="flex items-start gap-4">
                <Avatar
                  src={selectedDiscussion.user.image}
                  alt={selectedDiscussion.user.name}
                />
                <div>
                  <p className="text-gray-600">{selectedDiscussion.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <span>{selectedDiscussion.user.name}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(selectedDiscussion.createdAt))} ago
                    </span>
                  </div>
                </div>
              </div>

              {/* Replies */}
              <div className="space-y-4 mt-8">
                <h3 className="font-semibold">Replies</h3>
                {selectedDiscussion.replies.map(reply => (
                  <div key={reply.id} className="flex items-start gap-4 pl-8">
                    <Avatar src={reply.user.image} alt={reply.user.name} />
                    <div>
                      <p className="text-gray-600">{reply.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>{reply.user.name}</span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(reply.createdAt))} ago
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <div className="flex gap-4 mt-4">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                <Button onClick={createReply}>Reply</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 