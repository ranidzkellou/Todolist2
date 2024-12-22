import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { default as Cal } from './Calendar';

const CustomDateFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const handleDateClick = (date, isStart) => {
    if (isStart) {
      setStartDate(date);
      setShowStartCalendar(false);
    } else {
      setEndDate(date);
      setShowEndCalendar(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
      shadow-md text-lg leading-none px-4 gap-2 py-2 items-center flex bg-white font-light text-accent rounded-lg
      hover:bg-bluemain hover:text-white hover:scale-110 transition-all duration-200"
      >
        <Calendar size={20} />
        Calendar
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 w-[300px] bg-white border rounded-lg shadow-lg p-4 z-50">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[#0190F8]">From:</label>
            <div className="relative">
              <input
                type="text"
                value={formatDate(startDate)}
                onClick={() => {
                  setShowStartCalendar(!showStartCalendar);
                  setShowEndCalendar(false);
                }}
                readOnly
                className="w-full bg-[#0190F8] px-3 py-2 border rounded-lg cursor-pointer hover:border-[#0190F8] focus:outline-none focus:border-[#0190F8] placeholder-white"
                placeholder="Select start date"
              />
              
              {showStartCalendar && (
                
                <Cal 
                selectedDate={startDate}
                onDateSelect={(date) => handleDateClick(date, true)}
              />

              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[#0190F8]">To:</label>
            <div className="relative">
              <input
                type="text"
                value={formatDate(endDate)}
                onClick={() => {
                  setShowEndCalendar(!showEndCalendar);
                  setShowStartCalendar(false);
                }}
                readOnly
                className="w-full px-3 bg-[#0190F8] py-2 border rounded-lg cursor-pointer hover:border-[#0190F8] focus:outline-none focus:border-[#0190F8] placeholder-white"
                placeholder="Select end date"
              />
              
              {showEndCalendar && (
                                  <Cal 
                                  selectedDate={endDate}
                                  onDateSelect={(date) => handleDateClick(date, false)}
                                />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="flex-1 px-4 py-2 bg-[#0190F8] text-white rounded-lg hover:bg-[#0170D8] transition-colors"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
              className="flex-1 px-4 py-2 border border-[#0190F8] text-[#0190F8] rounded-lg hover:bg-[#F5F9FF] transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDateFilter;