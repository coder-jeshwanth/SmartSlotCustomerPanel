import React from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import BookingForm from './components/BookingForm';
import ConfirmationModal from './components/ConfirmationModal';
import { useBookingData } from './hooks/useBookingData';
import { formatDate } from './utils/dateUtils';
import './App.css';

function App() {
  const {
    selectedDate,
    selectedTime,
    customerData,
    showConfirmation,
    isLoading,
    currentMonth,
    currentYear,
    setSelectedDate,
    setSelectedTime,
    setCustomerData,
    setShowConfirmation,
    isDateAvailable,
    getAvailableTimeSlots,
    submitBooking,
    resetBooking,
    nextMonth,
    prevMonth
  } = useBookingData();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time selection when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSubmitBooking = async (bookingData) => {
    const success = await submitBooking(bookingData);
    if (!success) {
      alert('Booking failed. Please try again.');
    }
  };

  const handleBackToTimeSelection = () => {
    setSelectedTime(null);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    resetBooking();
  };

  const renderCurrentStep = () => {
    if (selectedDate && selectedTime) {
      return (
        <div className="step-container">
          <div className="step-header">
            <div className="step-icon">
              <User size={24} />
            </div>
            <div className="step-content">
              <h2>Complete Your Booking</h2>
              <p>Fill in your details to confirm your appointment</p>
            </div>
          </div>
          <BookingForm
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            customerData={customerData}
            onCustomerDataChange={setCustomerData}
            onSubmit={handleSubmitBooking}
            onBack={handleBackToTimeSelection}
            isLoading={isLoading}
          />
        </div>
      );
    }

    return (
      <>
        <div className="step-container">
          <div className="step-header">
            <div className="step-icon">
              <CalendarIcon size={24} />
            </div>
            <div className="step-content">
              <h2>Select a Date</h2>
              <p>Choose an available date from the calendar to view time slots</p>
            </div>
          </div>
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            isDateAvailable={isDateAvailable}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />
        </div>
        
        {selectedDate && (
          <div className="step-container">
            <div className="step-header">
              <div className="step-icon">
                <Clock size={24} />
              </div>
              <div className="step-content">
                <h2>Choose Your Time</h2>
                <p>Select your preferred time slot for {formatDate(selectedDate)}</p>
              </div>
            </div>
            <TimeSlots
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              getAvailableTimeSlots={getAvailableTimeSlots}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <Sparkles size={32} className="header-icon" />
            <h1 className="app-title">SmartSlot</h1>
          </div>
          <p className="app-subtitle">Book Your Perfect Time Slot</p>
        </div>
        <div className="header-decoration"></div>
      </header>

      <main className="app-main">
        <div className="container">
          {renderCurrentStep()}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 SmartSlot. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>

      <ConfirmationModal
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        customerData={customerData}
        onClose={handleCloseConfirmation}
        show={showConfirmation}
      />
    </div>
  );
}

export default App;
