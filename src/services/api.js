/**
 * API service for SmartSlot booking system
 */

// Use relative URL for proxied requests in development
// Vite proxy will forward /api requests to http://localhost:5000/api
const API_BASE_URL = '/api';

/**
 * Fetch available dates with timings and booking status
 * @returns {Promise<Object>} API response with available dates data
 */
export const fetchAvailableDatesWithTimings = async () => {
  try {
    console.log('🌐 Making API request to:', `${API_BASE_URL}/admin/dates/timings`);
    
    const response = await fetch(`${API_BASE_URL}/admin/dates/timings`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
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
        throw new Error('Cannot connect to server. Please ensure your backend server is running on http://localhost:5000. The Vite proxy is configured but the backend is not responding.');
      } else if (error.message.includes('NetworkError')) {
        throw new Error('Network error occurred. Check your internet connection and server status.');
      }
    }
    
    // Handle proxy/network errors
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      throw new Error('Backend server connection failed. Please start your backend server on http://localhost:5000 and try again.');
    }
    
    throw error;
  }
};

/**
 * Submit a booking request
 * @param {Object} bookingData - The booking information
 * @returns {Promise<Object>} API response
 */
export const submitBookingRequest = async (bookingData) => {
  try {
    console.log('🌐 Making booking request to:', `${API_BASE_URL}/booking/simple`);
    console.log('📤 Booking payload:', bookingData);
    
    const response = await fetch(`${API_BASE_URL}/booking/simple`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      body: JSON.stringify(bookingData),
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
        throw new Error('Cannot connect to server. Please ensure your backend server is running on http://localhost:5000.');
      } else if (error.message.includes('NetworkError')) {
        throw new Error('Network error occurred. Check your internet connection and server status.');
      }
    }
    
    // Handle proxy/network errors
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      throw new Error('Backend server connection failed. Please start your backend server on http://localhost:5000 and try again.');
    }
    
    throw error;
  }
};

export default {
  fetchAvailableDatesWithTimings,
  submitBookingRequest,
};