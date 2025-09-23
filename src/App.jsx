import React from 'react';
import { Toaster } from 'react-hot-toast';
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
    apiLoading,
    apiError,
    usingMockData,
    currentMonth,
    currentYear,
    bookingResponse,
    setSelectedDate,
    setSelectedTime,
    setCustomerData,
    setShowConfirmation,
    isDateAvailable,
    getAvailableTimeSlots,
    getDateData,
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
      // Error is handled in the hook and stored in apiError
      console.error('Booking submission failed');
    }
  };

  const handleBackToTimeSelection = () => {
    setSelectedTime(null);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    resetBooking();
  };

  const handleRetryApiConnection = () => {
    window.location.reload();
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
            getDateData={getDateData}
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
              getDateData={getDateData}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
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
          {usingMockData && (
            <div className="mock-data-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <strong>Demo Mode Active</strong>
                <p>
                  Using demo data because the API connection failed. Your backend is running on 
                  <code>http://localhost:5000</code>, but there might be a CORS or connection issue.
                </p>
                <button 
                  className="retry-api-button"
                  onClick={handleRetryApiConnection}
                >
                  🔄 Retry API Connection
                </button>
              </div>
            </div>
          )}
          
          {apiLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h2>Loading Available Dates...</h2>
              <p>Please wait while we fetch the latest booking information.</p>
            </div>
          ) : (
            renderCurrentStep()
          )}
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
        bookingData={bookingResponse?.data}
      />
    </div>
  );
}

export default App;
