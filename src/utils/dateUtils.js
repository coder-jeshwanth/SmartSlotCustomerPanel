/**
 * Date utility functions for SmartSlot booking system
 */

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  // Use local timezone instead of UTC to prevent date shift
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse date string to Date object
 * @param {string} dateString 
 * @returns {Date}
 */
export const parseDate = (dateString) => {
  return new Date(dateString + 'T00:00:00');
};

/**
 * Get all dates in a month
 * @param {number} year 
 * @param {number} month (0-based)
 * @returns {Date[]}
 */
export const getDatesInMonth = (year, month) => {
  const dates = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
    dates.push(new Date(date));
  }
  
  return dates;
};

/**
 * Get the first day of week for month display (Sunday = 0)
 * @param {number} year 
 * @param {number} month (0-based)
 * @returns {number}
 */
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

/**
 * Check if date is today or in the future
 * @param {Date} date 
 * @returns {boolean}
 */
export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Check if date is today
 * @param {Date} date 
 * @returns {boolean}
 */
export const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Generate time slots for a day (30-minute intervals)
 * @returns {string[]} Array of time strings in HH:MM format
 */
export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
};

/**
 * Format time for display (12-hour format)
 * @param {string} time24 Time in HH:MM format
 * @returns {string} Time in 12-hour format
 */
export const formatTimeDisplay = (time24) => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Get month name
 * @param {number} month (0-based)
 * @returns {string}
 */
export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

/**
 * Get day names for calendar header
 * @returns {string[]}
 */
export const getDayNames = () => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};