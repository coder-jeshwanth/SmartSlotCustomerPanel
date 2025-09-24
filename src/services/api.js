/**
 * API service for SmartSlot booking system
 */

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
    console.log(' Making API request to:', requestUrl);
    
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'no-cache'
    });

    console.log(' Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries([...response.headers.entries()])
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(' Data parsed successfully:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch available dates');
    }

    return data;
  } catch (error) {
    console.error(' API Error:', error);
    
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
    const requestUrl = `${API_BASE_URL}/booking/simple`;
    
    // Log incoming data for debugging
    console.log(' Incoming booking data:', bookingData);
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = bookingData.email || bookingData.email;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Please provide a valid email address');
    }
    
    // Validate phone number (exactly 10 digits)
    const phone = bookingData.phone || bookingData.phone;
    const phoneDigits = phone ? phone.replace(/\D/g, '') : '';
    if (!phoneDigits || phoneDigits.length !== 10) {
      throw new Error('Phone number must be exactly 10 digits');
    }
    
    // Check if data is already in the correct format (from useBookingData.js)
    let payload;
    if (bookingData.username && bookingData.date && bookingData.time) {
      // Data is already formatted correctly
      payload = {
        ...bookingData,
        phone: phoneDigits // Ensure phone is only digits
      };
    } else {
      // Data needs to be formatted (original bookingData format)
      let formattedDate;
      if (bookingData.selectedDate instanceof Date) {
        // Use local timezone instead of UTC to prevent date shift
        const year = bookingData.selectedDate.getFullYear();
        const month = String(bookingData.selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(bookingData.selectedDate.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      } else if (typeof bookingData.selectedDate === 'string') {
        formattedDate = bookingData.selectedDate;
      } else {
        console.error(' Invalid date format:', bookingData.selectedDate);
        throw new Error('Invalid date format. Expected Date object or YYYY-MM-DD string');
      }
      
      payload = {
        username: bookingData.name,
        email: email,
        phone: phoneDigits, // Ensure phone is only digits
        notes: bookingData.notes || '',
        date: formattedDate,
        time: bookingData.selectedTime
      };
    }
    
    // Ensure the final payload matches the expected structure exactly
    const finalPayload = {
      username: payload.username,
      email: payload.email,
      phone: payload.phone,
      notes: payload.notes || '',
      date: payload.date,
      time: payload.time
    };
    
    console.log(' Making booking request to:', requestUrl);
    console.log(' Final API payload:', finalPayload);
    
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalPayload),
    });

    console.log(' Booking response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries([...response.headers.entries()])
    });

    if (!response.ok) {
      // Get the error response body for more details
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP error! status: ${response.status} - ${response.statusText}`;
      console.error(' Error response from server:', errorData);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(' Booking data parsed successfully:', data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to submit booking');
    }

    return data;
  } catch (error) {
    console.error(' Booking API Error:', error);
    
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
