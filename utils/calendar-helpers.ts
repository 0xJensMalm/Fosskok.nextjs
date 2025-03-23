/**
 * Utility functions for calendar integration
 */

/**
 * Formats a date string for Google Calendar URL
 * @param dateString ISO date string
 * @returns Formatted date string for Google Calendar
 */
const formatDateForGoogleCalendar = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Format: YYYYMMDDTHHMMSSZ
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}00`;
};

/**
 * Creates a Google Calendar URL for an event
 * @param title Event title
 * @param description Event description
 * @param location Event location
 * @param startDate Start date (ISO string)
 * @param endDate End date (ISO string), defaults to 1 hour after start
 * @returns Google Calendar URL
 */
export const createGoogleCalendarUrl = (
  title: string,
  description: string,
  location: string,
  startDate: string,
  endDate?: string
): string => {
  const start = formatDateForGoogleCalendar(startDate);
  
  // If no end date is provided, default to 1 hour after start
  let end;
  if (endDate) {
    end = formatDateForGoogleCalendar(endDate);
  } else {
    const endDateTime = new Date(startDate);
    endDateTime.setHours(endDateTime.getHours() + 1);
    end = formatDateForGoogleCalendar(endDateTime.toISOString());
  }
  
  // Encode parameters for URL
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    location,
    dates: `${start}/${end}`,
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Creates an iCal URL for an event
 * This is a simplified version that works with many calendar apps
 */
export const createICalUrl = (
  title: string,
  description: string,
  location: string,
  startDate: string,
  endDate?: string
): string => {
  // For simplicity, we'll use the Google Calendar URL which is widely supported
  return createGoogleCalendarUrl(title, description, location, startDate, endDate);
};
