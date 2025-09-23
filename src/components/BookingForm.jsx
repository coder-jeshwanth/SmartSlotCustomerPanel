import React, { useState } from 'react';
import { User, Mail, Phone, MessageSquare, ArrowLeft, CheckCircle, Loader } from 'lucide-react';
import { formatTimeDisplay } from '../utils/dateUtils';
import './BookingForm.css';

const BookingForm = ({ 
  selectedDate, 
  selectedTime, 
  customerData, 
  onCustomerDataChange, 
  onSubmit, 
  onBack, 
  isLoading 
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    onCustomerDataChange({
      ...customerData,
      [name]: value
    });

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const fields = ['name', 'email', 'phone'];
    
    fields.forEach(field => {
      const error = validateField(field, customerData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      notes: true
    });

    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      onSubmit(customerData);
    }
  };

  const selectedDateString = selectedDate?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="booking-form">
      <div className="booking-form-header">
        <h3>Complete Your Booking</h3>
        <div className="booking-summary">
          <div className="summary-item">
            <span className="summary-label">Date:</span>
            <span className="summary-value">{selectedDateString}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Time:</span>
            <span className="summary-value">{formatTimeDisplay(selectedTime)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <User size={16} />
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerData.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your full name"
            disabled={isLoading}
          />
          {errors.name && (
            <span className="error-message">{errors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            <Mail size={16} />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email address"
            disabled={isLoading}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            <Phone size={16} />
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={customerData.phone}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="Enter your phone number"
            disabled={isLoading}
          />
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            <MessageSquare size={16} />
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={customerData.notes}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="form-textarea"
            placeholder="Any special requests or additional information..."
            rows="4"
            disabled={isLoading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            <ArrowLeft size={16} />
            Back to Time Selection
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size={16} className="spinner" />
                Booking...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Confirm Booking
              </>
            )}
          </button>
        </div>
      </form>

      <div className="booking-info">
        <div className="info-item">
          <strong>📅 Booking Policy:</strong>
          <p>Your booking will be confirmed immediately. You'll receive a confirmation email shortly.</p>
        </div>
        <div className="info-item">
          <strong>📞 Contact:</strong>
          <p>For questions or changes, please contact us at support@smartslot.com</p>
        </div>
        <div className="info-item">
          <strong>🔄 Cancellation:</strong>
          <p>Free cancellation up to 24 hours before your appointment</p>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;