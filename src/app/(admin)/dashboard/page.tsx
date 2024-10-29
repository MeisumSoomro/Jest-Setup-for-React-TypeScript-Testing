import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { 
  UserManagement,
  SystemSettings,
  ContentModeration,
  PlatformAnalytics 
} from '@/components/admin';

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <UserManagement />
          </Suspense>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <SystemSettings />
          </Suspense>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Content Moderation</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <ContentModeration />
          </Suspense>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Platform Analytics</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <PlatformAnalytics />
          </Suspense>
        </Card>
      </div>
    </div>
  );
} 