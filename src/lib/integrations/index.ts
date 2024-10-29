/**
 * Integration Services Configuration
 * 
 * This file exports configuration and setup for third-party integrations.
 * Each integration requires specific API keys set in .env file.
 * 
 * Required Environment Variables:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 * - MS_TEAMS_CLIENT_ID
 * - MS_TEAMS_CLIENT_SECRET
 * - ZOOM_CLIENT_ID
 * - ZOOM_CLIENT_SECRET
 */

export * from './google-calendar';
export * from './google-drive';
export * from './microsoft-teams';
export * from './zoom';