import React, { useEffect } from 'react';
import { CheckCircle2, Calendar, Clock, User, Mail, Phone, X, Download, Share2 } from 'lucide-react';
import { formatTimeDisplay } from '../utils/dateUtils';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  selectedDate, 
  selectedTime, 
  customerData, 
  onClose, 
  show 
}) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBookAnother = () => {
    onClose();
  };

  const selectedDateString = selectedDate?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <div className="success-animation">
            <CheckCircle2 size={64} className="success-icon" />
          </div>
          <h2>Booking Confirmed!</h2>
          <p className="success-message">
            Your appointment has been successfully scheduled. You'll receive a confirmation email shortly.
          </p>
        </div>

        <div className="booking-details">
          <h3>Booking Details</h3>
          
          <div className="detail-grid">
            <div className="detail-item">
              <Calendar size={20} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Date</span>
                <span className="detail-value">{selectedDateString}</span>
              </div>
            </div>

            <div className="detail-item">
              <Clock size={20} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Time</span>
                <span className="detail-value">{formatTimeDisplay(selectedTime)}</span>
              </div>
            </div>

            <div className="detail-item">
              <User size={20} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Name</span>
                <span className="detail-value">{customerData.name}</span>
              </div>
            </div>

            <div className="detail-item">
              <Mail size={20} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Email</span>
                <span className="detail-value">{customerData.email}</span>
              </div>
            </div>

            <div className="detail-item">
              <Phone size={20} className="detail-icon" />
              <div className="detail-content">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{customerData.phone}</span>
              </div>
            </div>

            {customerData.notes && (
              <div className="detail-item notes">
                <div className="detail-content">
                  <span className="detail-label">Notes</span>
                  <span className="detail-value">{customerData.notes}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="next-steps">
          <h4>What's Next?</h4>
          <div className="steps-list">
            <div className="step-item">
              <span className="step-number">1</span>
              <div className="step-content">
                <strong>Confirmation Email</strong>
                <p>Check your email for booking confirmation and details</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <div className="step-content">
                <strong>Calendar Reminder</strong>
                <p>Add this appointment to your calendar</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <div className="step-content">
                <strong>Prepare for Your Visit</strong>
                <p>Arrive 5-10 minutes early for your appointment</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-info">
          <h4>Need Help?</h4>
          <div className="contact-methods">
            <div className="contact-item">
              <Mail size={16} className="contact-icon" />
              <span>support@smartslot.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} className="contact-icon" />
              <span>(555) 123-4567</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleBookAnother}
            autoFocus
          >
            <Download size={16} />
            Book Another Appointment
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            <Share2 size={16} />
            Share Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;