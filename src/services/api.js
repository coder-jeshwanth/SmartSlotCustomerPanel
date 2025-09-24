/**
 * API service for SmartSlot booking system
 */

// Use proxy in development, full URL in production
const isProduction = import.meta.env.PROD;
const BACKEND_URL = isProduction ? 'https://smart-slot-backend.vercel.app' : '';
const API_BASE_URL = `${BACKEND_URL}/api`;

/**
 * Fetch available dates with timings and booking status
 * @returns {Promise<Object>} API response with available dates data
 */
export const fetchAvailableDatesWithTimings = async () => {
  try {
    const requestUrl = `${API_BASE_URL}/admin/dates/timings`;
    console.log('🌐 Making API request to:', requestUrl);
    
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'no-cache'
    });

    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries([...response.headers.entries()])
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Data parsed successfully:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch available dates');
    }

    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    
    // Provide more specific error messages
    if (error.name === 'TypeError') {
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. The backend server at smart-slot-backend.vercel.app is not responding.');
      } else if (error.message.includes('NetworkError')) {
        throw new Error('Network error occurred. Check your internet connection and server status.');
      }
    }
    
    // Handle proxy/network errors
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      throw new Error('Backend server connection failed. The server at smart-slot-backend.vercel.app returned an error.');
    }
    
    throw error;
  }
};

/**
 * Submit a booking request
 * @param {Object} bookingData - The booking information containing customer details
 * @param {string} bookingData.name - Customer's full name
 * @param {string} bookingData.email - Customer's email address
 * @param {string} bookingData.phone - Customer's phone number (10 digits)
 * @param {string} bookingData.notes - Additional notes (optional)
 * @param {Date} bookingData.selectedDate - Selected booking date
 * @param {string} bookingData.selectedTime - Selected time slot (HH:mm format)
 * @returns {Promise<Object>} API response
 */
export const submitBookingRequest = async (bookingData) => {
  try {
    const requestUrl = 'https://smart-slot-backend.vercel.app/api/booking/simple';
    
    // Log incoming data for debugging
    console.log('📝 Incoming booking data:', bookingData);
    
    // Check if data is already in the correct format (from useBookingData.js)
    let payload;
    if (bookingData.username && bookingData.date && bookingData.time) {
      // Data is already formatted correctly
      payload = bookingData;
    } else {
      // Data needs to be formatted (original bookingData format)
      let formattedDate;
      if (bookingData.selectedDate instanceof Date) {
        formattedDate = bookingData.selectedDate.toISOString().split('T')[0];
      } else if (typeof bookingData.selectedDate === 'string') {
        formattedDate = bookingData.selectedDate;
      } else {
        console.error('❌ Invalid date format:', bookingData.selectedDate);
        throw new Error('Invalid date format. Expected Date object or YYYY-MM-DD string');
      }
      
      payload = {
        username: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        notes: bookingData.notes || '',
        date: formattedDate,
        time: bookingData.selectedTime
      };
    }
    
    console.log('🌐 Making booking request to:', requestUrl);
    console.log('� Final API payload:', payload);
    
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    console.log('📡 Booking response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries([...response.headers.entries()])
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Booking data parsed successfully:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to submit booking');
    }

    return data;
  } catch (error) {
    console.error('❌ Booking API Error:', error);
    
    // Provide more specific error messages
    if (error.name === 'TypeError') {
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Please ensure the backend server is available at https://smart-slot-backend.vercel.app');
      } else if (error.message.includes('NetworkError')) {
        throw new Error('Network error occurred. Check your internet connection and server status.');
      }
    }
    
    // Handle proxy/network errors
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      throw new Error('Backend server connection failed. Please check if the server at https://smart-slot-backend.vercel.app is functioning properly.');
    }
    
    throw error;
  }
};

export default {
  fetchAvailableDatesWithTimings,
  submitBookingRequest,
};