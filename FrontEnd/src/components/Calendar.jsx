/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const Calendar = ({ selectedDate, onDateSelect, monthData }) => {
  const [calendarDates, setCalendarDates] = useState([]);
  
  useEffect(() => {
    if (monthData) {
      generateCalendarDates();
    }
  }, [monthData]);

  const generateCalendarDates = () => {
    const dates = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    currentDate.setDate(1);
    const firstDayIndex = currentDate.getDay();
    
    for (let i = 0; i < firstDayIndex; i++) {
      dates.push(null);
    }
    
    monthData.days.forEach(dayData => {
      const dayDate = new Date(dayData.date);
      if (dayDate.getMonth() === currentMonth && dayDate.getFullYear() === currentYear) {
        dates.push({
          date: dayDate,
          data: dayData
        });
      }
    });
    
    setCalendarDates(dates);
  };

  const handleDateClick = (date) => {
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className="w-full bg-bluemain rounded-lg p-2 select-none">
      <div className="grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-sm p-1 text-white font-bold">
            {day}
          </div>
        ))}
        {calendarDates.map((date, index) => (
          <div
            key={index}
            onClick={() => date && handleDateClick(date.date)}
            className={`
              text-center p-1 cursor-pointer rounded transition-colors
              ${!date ? 'bg-transparent' : 
                date && selectedDate && date.date.toDateString() === selectedDate.toDateString()
                ? 'bg-accent text-white font-bold hover:bg-accent'
                : 'bg-white text-blue-500 hover:bg-blue-100'
              }
            `}
          >
            {date ? date.date.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;