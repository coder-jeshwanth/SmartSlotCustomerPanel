import React from 'react';
import { formatTimeDisplay, generateTimeSlots } from '../utils/dateUtils';
import './TimeSlots.css';

const TimeSlots = ({ 
  selectedDate, 
  selectedTime, 
  onTimeSelect, 
  getAvailableTimeSlots 
}) => {
  if (!selectedDate) {
    return (
      <div className="time-slots-placeholder">
        <div className="placeholder-icon">📅</div>
        <h3>Select a Date</h3>
        <p>Choose an available date from the calendar to view time slots</p>
      </div>
    );
  }

  const dateString = selectedDate.toISOString().split('T')[0];
  const availableSlots = getAvailableTimeSlots(dateString);
  const allSlots = generateTimeSlots();

  // Group slots by time periods for better organization
  const groupedSlots = {
    morning: allSlots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 6 && hour < 12;
    }),
    afternoon: allSlots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 12 && hour < 17;
    }),
    evening: allSlots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return hour >= 17 && hour < 22;
    }),
    night: allSlots.filter(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return (hour >= 22) || (hour >= 0 && hour < 6);
    })
  };

  const handleTimeClick = (timeSlot) => {
    if (availableSlots.includes(timeSlot)) {
      onTimeSelect(timeSlot);
    }
  };

  const getTimeSlotClassName = (timeSlot) => {
    const classes = ['time-slot'];
    
    if (availableSlots.includes(timeSlot)) {
      classes.push('available');
      if (selectedTime === timeSlot) {
        classes.push('selected');
      }
    } else {
      classes.push('booked');
    }
    
    return classes.join(' ');
  };

  const renderTimeGroup = (title, slots, icon) => {
    const groupSlots = slots.filter(slot => availableSlots.includes(slot) || !availableSlots.includes(slot));
    
    if (groupSlots.length === 0) return null;

    return (
      <div className="time-group" key={title}>
        <div className="time-group-header">
          <span className="time-group-icon">{icon}</span>
          <h4 className="time-group-title">{title}</h4>
          <span className="available-count">
            {slots.filter(slot => availableSlots.includes(slot)).length} available
          </span>
        </div>
        <div className="time-slots-grid">
          {groupSlots.map(timeSlot => (
            <button
              key={timeSlot}
              className={getTimeSlotClassName(timeSlot)}
              onClick={() => handleTimeClick(timeSlot)}
              disabled={!availableSlots.includes(timeSlot)}
              aria-label={`${formatTimeDisplay(timeSlot)} ${availableSlots.includes(timeSlot) ? 'available' : 'booked'}`}
            >
              {formatTimeDisplay(timeSlot)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const selectedDateString = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="time-slots">
      <div className="time-slots-header">
        <h3>Available Time Slots</h3>
        <p className="selected-date-display">{selectedDateString}</p>
        <div className="slots-summary">
          <span className="total-available">
            {availableSlots.length} slots available
          </span>
        </div>
      </div>

      {availableSlots.length === 0 ? (
        <div className="no-slots-message">
          <div className="no-slots-icon">❌</div>
          <h4>No Available Slots</h4>
          <p>All time slots for this date are fully booked. Please select another date.</p>
        </div>
      ) : (
        <div className="time-groups">
          {renderTimeGroup('Morning', groupedSlots.morning, '🌅')}
          {renderTimeGroup('Afternoon', groupedSlots.afternoon, '☀️')}
          {renderTimeGroup('Evening', groupedSlots.evening, '🌆')}
          {renderTimeGroup('Night', groupedSlots.night, '🌙')}
        </div>
      )}

      <div className="time-slots-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color booked"></span>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlots;