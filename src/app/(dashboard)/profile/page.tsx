'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  achievements: Array<{
    id: string;
    name: string;
    icon: string;
    earnedAt: Date;
  }>;
  enrolledCourses: Array<{
    id: string;
    title: string;
    progress: number;
  }>;
  certificates: Array<{
    id: string;
    courseTitle: string;
    issuedAt: Date;
    pdfUrl: string;
  }>;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name,
        bio: data.bio,
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar
            src={profile.image}
            alt={profile.name}
            className="w-24 h-24"
          />
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                />
                <Input
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Bio"
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProfile}>Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-600">{profile.bio}</p>
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          {profile.enrolledCourses.map((course) => (
            <Card key={course.id} className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{course.title}</h3>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">
                    {course.progress}%
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.achievements.map((achievement) => (
            <Card key={achievement.id} className="p-4 text-center">
              <img
                src={achievement.icon}
                alt={achievement.name}
                className="w-16 h-16 mx-auto"
              />
              <h3 className="font-semibold mt-2">{achievement.name}</h3>
              <p className="text-sm text-gray-500">
                Earned {new Date(achievement.earnedAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          {profile.certificates.map((certificate) => (
            <Card key={certificate.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{certificate.courseTitle}</h3>
                  <p className="text-sm text-gray-500">
                    Issued on {new Date(certificate.issuedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.open(certificate.pdfUrl, '_blank')}
                >
                  View Certificate
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
} 