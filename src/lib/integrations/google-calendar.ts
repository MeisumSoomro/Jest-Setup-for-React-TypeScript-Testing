import { google } from 'googleapis';

const calendar = google.calendar('v3');
const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const createCalendarEvent = async (eventDetails) => {
  try {
    const event = await calendar.events.insert({
      auth,
      calendarId: 'primary',
      requestBody: eventDetails,
    });
    return event.data;
  } catch (error) {
    throw new Error('Failed to create calendar event');
  }
}; 