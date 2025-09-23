import { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';

/**
 * Custom hook for managing booking data and state
 */
export const useBookingData = () => {
  // Mock data for available dates (admin-configured)
  const [availableDates] = useState(new Set([
    '2025-09-25', '2025-09-26', '2025-09-30',
    '2025-10-01', '2025-10-05', '2025-10-10',
    '2025-10-15', '2025-10-20', '2025-10-25',
    '2025-11-01', '2025-11-05', '2025-11-10',
    '2025-11-15', '2025-11-20', '2025-11-25'
  ]));

  // Mock data for booked slots
  const [bookedSlots] = useState(new Map([
    ['2025-09-25', new Map([
      ['14:00', { customer: 'John Doe', email: 'john@email.com', phone: '555-0101' }],
      ['15:30', { customer: 'Jane Smith', email: 'jane@email.com', phone: '555-0102' }],
      ['10:00', { customer: 'Bob Johnson', email: 'bob@email.com', phone: '555-0103' }]
    ])],
    ['2025-09-26', new Map([
      ['09:00', { customer: 'Alice Brown', email: 'alice@email.com', phone: '555-0104' }],
      ['16:00', { customer: 'Charlie Davis', email: 'charlie@email.com', phone: '555-0105' }]
    ])],
    ['2025-10-01', new Map([
      ['11:30', { customer: 'Eva Wilson', email: 'eva@email.com', phone: '555-0106' }],
      ['13:00', { customer: 'Frank Miller', email: 'frank@email.com', phone: '555-0107' }]
    ])]
  ]));

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

  // Calendar navigation state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  /**
   * Check if a date is available for booking
   * @param {string} dateString 
   * @returns {boolean}
   */
  const isDateAvailable = (dateString) => {
    return availableDates.has(dateString);
  };

  /**
   * Check if a time slot is booked
   * @param {string} dateString 
   * @param {string} timeString 
   * @returns {boolean}
   */
  const isTimeSlotBooked = (dateString, timeString) => {
    return bookedSlots.has(dateString) && bookedSlots.get(dateString).has(timeString);
  };

  /**
   * Get available time slots for a date
   * @param {string} dateString 
   * @returns {string[]}
   */
  const getAvailableTimeSlots = (dateString) => {
    if (!isDateAvailable(dateString)) return [];
    
    const allSlots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (!isTimeSlotBooked(dateString, timeString)) {
          allSlots.push(timeString);
        }
      }
    }
    return allSlots;
  };

  /**
   * Submit booking
   * @param {Object} bookingData 
   * @returns {Promise<boolean>}
   */
  const submitBooking = async (bookingData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add booking to mock data
      const dateString = formatDate(selectedDate);
      if (!bookedSlots.has(dateString)) {
        bookedSlots.set(dateString, new Map());
      }
      bookedSlots.get(dateString).set(selectedTime, {
        customer: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        notes: bookingData.notes,
        bookedAt: new Date().toISOString()
      });
      
      setShowConfirmation(true);
      return true;
    } catch (error) {
      console.error('Booking failed:', error);
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
    bookedSlots,
    
    // State
    selectedDate,
    selectedTime,
    customerData,
    showConfirmation,
    isLoading,
    currentMonth,
    currentYear,
    
    // Setters
    setSelectedDate,
    setSelectedTime,
    setCustomerData,
    setShowConfirmation,
    
    // Functions
    isDateAvailable,
    isTimeSlotBooked,
    getAvailableTimeSlots,
    submitBooking,
    resetBooking,
    nextMonth,
    prevMonth
  };
};