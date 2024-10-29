import { io } from 'socket.io-client';

/**
 * WebSocket Configuration
 * 
 * Purpose: Enables real-time features
 * Usage: Used for:
 * - Live chat in courses
 * - Real-time notifications
 * - Live course updates
 * 
 * Required Setup:
 * 1. WebSocket server running
 * 2. NEXT_PUBLIC_SOCKET_URL in .env
 * 
 * Related Components:
 * - chat components
 * - notification components
 */
export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
  autoConnect: false,
});

export const connectSocket = (userId: string) => {
  socket.auth = { userId };
  socket.connect();
}; 