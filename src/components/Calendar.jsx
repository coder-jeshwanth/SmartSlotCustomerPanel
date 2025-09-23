import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { 
  formatDate, 
  getDatesInMonth, 
  getFirstDayOfMonth, 
  isFutureDate, 
  isToday, 
  getMonthName, 
  getDayNames 
} from '../utils/dateUtils';
import './Calendar.css';

const Calendar = ({ 
  currentMonth, 
  currentYear, 
  selectedDate, 
  onDateSelect, 
  isDateAvailable, 
  getDateData,
  onPrevMonth, 
  onNextMonth 
}) => {
  const dates = getDatesInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);
  const dayNames = getDayNames();
  
  // Create empty cells for days before the first day of the month
  const emptyCells = Array(firstDayOfWeek).fill(null);
  
  const today = new Date();
  const canGoPrev = currentYear > today.getFullYear() || 
    (currentYear === today.getFullYear() && currentMonth > today.getMonth());

  const handleDateClick = (date) => {
    const dateString = formatDate(date);
    const dateData = getDateData(dateString);
    
    if (isFutureDate(date) && dateData && dateData.availableSlots > 0) {
      onDateSelect(date);
    }
  };

  const getDateClassName = (date) => {
    const dateString = formatDate(date);
    const classes = ['calendar-date'];
    const dateData = getDateData(dateString);
    
    if (!isFutureDate(date)) {
      classes.push('past');
    } else if (dateData) {
      // Date exists in API data
      if (dateData.availableSlots === 0) {
        // All slots are booked - show as fully booked (red)
        classes.push('fully-booked');
      } else {
        // Has available slots
        classes.push('available');
        if (selectedDate && formatDate(selectedDate) === dateString) {
          classes.push('selected');
        }
      }
    } else {
      // Date not in API data - unavailable
      classes.push('unavailable');
    }
    
    if (isToday(date)) {
      classes.push('today');
    }
    
    return classes.join(' ');
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button 
          className="nav-button" 
          onClick={onPrevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="calendar-title">
          <CalendarIcon size={20} className="calendar-title-icon" />
          <h2 className="month-year">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
        </div>
        
        <button 
          className="nav-button" 
          onClick={onNextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
        
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="calendar-date empty"></div>
        ))}
        
        {dates.map(date => {
          const dateString = formatDate(date);
          const dateData = getDateData(dateString);
          const isClickable = isFutureDate(date) && dateData && dateData.availableSlots > 0;
          
          return (
            <button
              key={date.getDate()}
              className={getDateClassName(date)}
              onClick={() => handleDateClick(date)}
              disabled={!isClickable}
              aria-label={`${formatDate(date)} ${isClickable ? 'available' : 'unavailable'}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color fully-booked"></span>
          <span>Fully Booked</span>
        </div>
        <div className="legend-item">
          <span className="legend-color unavailable"></span>
          <span>Unavailable</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;