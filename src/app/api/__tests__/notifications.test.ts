import { GET, POST } from '../notifications/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    notification: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('Notifications API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/notifications', () => {
    it('returns notifications array', async () => {
      const mockNotifications = [{ id: '1', message: 'Test' }];
      (prisma.notification.findMany as jest.Mock).mockResolvedValue(mockNotifications);

      const req = new NextRequest(new Request('http://localhost:3000/api/notifications'));
      const res = await GET(req);
      const data = await res.json();

      expect(data.notifications).toEqual(mockNotifications);
    });
  });

  describe('POST /api/notifications', () => {
    it('creates new notification', async () => {
      const mockNotification = { id: '1', message: 'New notification' };
      (prisma.notification.create as jest.Mock).mockResolvedValue(mockNotification);

      const req = new NextRequest(
        'http://localhost:3000/api/notifications',
        {
          method: 'POST',
          body: JSON.stringify({ message: 'New notification' }),
        }
      );
      const res = await POST(req);
      const data = await res.json();

      expect(data.status).toBe('created');
    });
  });
}); 