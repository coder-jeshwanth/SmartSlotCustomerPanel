import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/dateUtils';
import { fetchAvailableDatesWithTimings, submitBookingRequest } from '../services/api';

/**
 * Mock data fallback when API is not available
 */
const getMockData = () => ({
  success: true,
  message: "Mock data loaded (API unavailable)",
  timestamp: new Date().toISOString(),
  data: {
    summary: {
      totalAvailableDates: 4,
      fromDate: "2025-09-25",
      totalBookedSlots: 2,
      totalAvailableSlots: 50
    },
    availableDates: [
      {
        id: "mock-1",
        date: "2025-09-25",
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 30,
        timings: "09:00 - 17:00",
        totalSlots: 16,
        bookedSlots: 2,
        availableSlots: 14,
        timeSlots: [
          { time: "09:00", isBooked: false, bookingStatus: null },
          { time: "09:30", isBooked: true, bookingStatus: "confirmed" },
          { time: "10:00", isBooked: false, bookingStatus: null },
          { time: "10:30", isBooked: false, bookingStatus: null },
          { time: "11:00", isBooked: false, bookingStatus: null },
          { time: "11:30", isBooked: false, bookingStatus: null },
          { time: "12:00", isBooked: false, bookingStatus: null },
          { time: "12:30", isBooked: false, bookingStatus: null },
          { time: "13:00", isBooked: false, bookingStatus: null },
          { time: "13:30", isBooked: false, bookingStatus: null },
          { time: "14:00", isBooked: true, bookingStatus: "confirmed" },
          { time: "14:30", isBooked: false, bookingStatus: null },
          { time: "15:00", isBooked: false, bookingStatus: null },
          { time: "15:30", isBooked: false, bookingStatus: null },
          { time: "16:00", isBooked: false, bookingStatus: null },
          { time: "16:30", isBooked: false, bookingStatus: null }
        ]
      },
      {
        id: "mock-2",
        date: "2025-09-26",
        startTime: "08:00",
        endTime: "18:00",
        slotDuration: 60,
        timings: "08:00 - 18:00",
        totalSlots: 10,
        bookedSlots: 0,
        availableSlots: 10,
        timeSlots: [
          { time: "08:00", isBooked: false, bookingStatus: null },
          { time: "09:00", isBooked: false, bookingStatus: null },
          { time: "10:00", isBooked: false, bookingStatus: null },
          { time: "11:00", isBooked: false, bookingStatus: null },
          { time: "12:00", isBooked: false, bookingStatus: null },
          { time: "13:00", isBooked: false, bookingStatus: null },
          { time: "14:00", isBooked: false, bookingStatus: null },
          { time: "15:00", isBooked: false, bookingStatus: null },
          { time: "16:00", isBooked: false, bookingStatus: null },
          { time: "17:00", isBooked: false, bookingStatus: null }
        ]
      },
      {
        id: "mock-3",
        date: "2025-09-30",
        startTime: "10:00",
        endTime: "16:00",
        slotDuration: 15,
        timings: "10:00 - 16:00",
        totalSlots: 24,
        bookedSlots: 24,
        availableSlots: 0,
        timeSlots: Array.from({ length: 24 }, (_, i) => {
          const hour = Math.floor(i / 4) + 10;
          const minute = (i % 4) * 15;
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          return { time, isBooked: true, bookingStatus: "confirmed" };
        })
      },
      {
        id: "mock-4",
        date: "2025-10-01",
        startTime: "12:00",
        endTime: "18:00",
        slotDuration: 90,
        timings: "12:00 - 18:00",
        totalSlots: 4,
        bookedSlots: 0,
        availableSlots: 4,
        timeSlots: [
          { time: "12:00", isBooked: false, bookingStatus: null },
          { time: "13:30", isBooked: false, bookingStatus: null },
          { time: "15:00", isBooked: false, bookingStatus: null },
          { time: "16:30", isBooked: false, bookingStatus: null }
        ]
      }
    ]
  }
});

/**
 * Custom hook for managing booking data and state
 */
export const useBookingData = () => {
  // API data states
  const [availableDates, setAvailableDates] = useState(new Set());
  const [datesData, setDatesData] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Current booking state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  // Calendar navigation state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  /**
   * Fetch available dates from API
   */
  useEffect(() => {
    const loadAvailableDates = async () => {
      try {
        setApiLoading(true);
        setApiError(null);
        setUsingMockData(false);
        
        console.log('🔄 Attempting to fetch data from API...');
        const response = await fetchAvailableDatesWithTimings();
        console.log('📡 API Response received:', response);
        
        const { availableDates: dates } = response.data;
        
        // Create set of available dates
        const dateSet = new Set(dates.map(dateObj => dateObj.date));
        setAvailableDates(dateSet);
        setDatesData(dates);
        
        console.log('✅ Successfully loaded data from API');
        console.log('📊 Loaded dates:', dates.map(d => d.date));
        
      } catch (error) {
        console.error('❌ Failed to load available dates:', error);
        console.error('🔍 Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        setApiError(error.message);
        
        // Fall back to mock data
        console.log('🔄 Falling back to mock data...');
        const mockResponse = getMockData();
        const { availableDates: dates } = mockResponse.data;
        
        const dateSet = new Set(dates.map(dateObj => dateObj.date));
        setAvailableDates(dateSet);
        setDatesData(dates);
        setUsingMockData(true);
        
        console.log('📋 Mock data loaded successfully');
        console.log('📊 Mock dates:', dates.map(d => d.date));
        
      } finally {
        setApiLoading(false);
      }
    };

    loadAvailableDates();
  }, []);

  /**
   * Check if a date is available for booking
   * @param {string} dateString 
   * @returns {boolean}
   */
  const isDateAvailable = (dateString) => {
    const dateData = datesData.find(d => d.date === dateString);
    if (!dateData) return false;
    
    // Check if all slots are booked (date should appear red)
    const allSlotsBooked = dateData.availableSlots === 0;
    return !allSlotsBooked;
  };

  /**
   * Check if a time slot is booked
   * @param {string} dateString 
   * @param {string} timeString 
   * @returns {boolean}
   */
  const isTimeSlotBooked = (dateString, timeString) => {
    const dateData = datesData.find(d => d.date === dateString);
    if (!dateData) return true;
    
    const timeSlot = dateData.timeSlots.find(slot => slot.time === timeString);
    return timeSlot ? timeSlot.isBooked : true;
  };

  /**
   * Get available time slots for a date
   * @param {string} dateString 
   * @returns {string[]}
   */
  const getAvailableTimeSlots = (dateString) => {
    const dateData = datesData.find(d => d.date === dateString);
    if (!dateData) return [];
    
    return dateData.timeSlots
      .filter(slot => !slot.isBooked)
      .map(slot => slot.time);
  };

  /**
   * Get date data with time slots
   * @param {string} dateString 
   * @returns {Object|null}
   */
  const getDateData = (dateString) => {
    return datesData.find(d => d.date === dateString) || null;
  };

  /**
   * Submit booking
   * @param {Object} bookingData 
   * @returns {Promise<boolean>}
   */
  const submitBooking = async (bookingData) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const selectedDateString = formatDate(selectedDate);
      
      const payload = {
        username: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        notes: bookingData.notes || "",
        date: selectedDateString,
        time: selectedTime
      };
      
      if (usingMockData) {
        // Simulate API call for mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('📋 Mock booking submitted:', payload);
        
        // Create mock response similar to real API
        const mockResponse = {
          success: true,
          message: "Booking created successfully",
          timestamp: new Date().toISOString(),
          data: {
            id: "mock-" + Date.now(),
            bookingReference: "SM" + new Date().getFullYear() + 
                             String(new Date().getMonth() + 1).padStart(2, '0') + 
                             String(new Date().getDate()).padStart(2, '0') + 
                             String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
            date: selectedDateString,
            timeSlot: selectedTime,
            customer: {
              name: bookingData.name,
              email: bookingData.email,
              phone: bookingData.phone,
              notes: bookingData.notes || ""
            },
            status: "confirmed",
            createdAt: new Date().toISOString()
          }
        };
        
        setBookingResponse(mockResponse);
        toast.success(mockResponse.message);
        
      } else {
        const response = await submitBookingRequest(payload);
        console.log('✅ Real booking submitted:', payload);
        console.log('📥 Booking response:', response);
        
        setBookingResponse(response);
        toast.success(response.message);
      }
      
      // Refresh the available dates after successful booking
      try {
        const response = await fetchAvailableDatesWithTimings();
        const { availableDates: dates } = response.data;
        
        const dateSet = new Set(dates.map(dateObj => dateObj.date));
        setAvailableDates(dateSet);
        setDatesData(dates);
        setUsingMockData(false);
      } catch (refreshError) {
        console.log('Failed to refresh data after booking, keeping current state');
      }
      
      setShowConfirmation(true);
      return true;
    } catch (error) {
      console.error('Booking failed:', error);
      setApiError(error.message);
      toast.error(`Booking failed: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset booking state
   */
  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setCustomerData({
      name: '',
      email: '',
      phone: '',
      notes: ''
    });
    setShowConfirmation(false);
    setBookingResponse(null);
  };

  /**
   * Navigate to next month
   */
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /**
   * Navigate to previous month
   */
  const prevMonth = () => {
    const today = new Date();
    const targetDate = new Date(currentYear, currentMonth - 1);
    
    // Don't allow navigation to past months
    if (targetDate < new Date(today.getFullYear(), today.getMonth())) {
      return;
    }
    
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return {
    // Data
    availableDates,
    datesData,
    
    // State
    selectedDate,
    selectedTime,
    customerData,
    showConfirmation,
    isLoading,
    apiLoading,
    apiError,
    usingMockData,
    currentMonth,
    currentYear,
    bookingResponse,
    
    // Setters
    setSelectedDate,
    setSelectedTime,
    setCustomerData,
    setShowConfirmation,
    
    // Functions
    isDateAvailable,
    isTimeSlotBooked,
    getAvailableTimeSlots,
    getDateData,
    submitBooking,
    resetBooking,
    nextMonth,
    prevMonth
  };
};