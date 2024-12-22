/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const generateWeekDates = (startDate) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return days.map((day, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);

    return {
      day,
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      totalTasks: 0,
      completedTasks: 0,
      remainingTasks: 0
    };
  });
};

const TaskCompletionChart = ({ date }) => {
  const initialDate = date instanceof Date ? date : new Date();

  const [currentWeek, setCurrentWeek] = useState({
    start: new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate() - initialDate.getDay())
  });
  const [taskData, setTaskData] = useState(() => generateWeekDates(currentWeek.start));

  useEffect(() => {
    const validDate = date instanceof Date ? date : new Date();
    const weekStart = new Date(validDate.getFullYear(), validDate.getMonth(), validDate.getDate() - validDate.getDay());

    setCurrentWeek({ start: weekStart });
    fetchTaskData(weekStart);
  }, [date]);

  const fetchTaskData = async (weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const formatDate = (date) => {
      return date.getFullYear() + '-' 
           + String(date.getMonth() + 1).padStart(2, '0') + '-' 
           + String(date.getDate()).padStart(2, '0');
    };

    try {
      const response = await fetch(`http://localhost:5001/summary`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startDate: formatDate(weekStart), 
          endDate: formatDate(weekEnd)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch task data');
      }

      const data = await response.json();
      
      // Create a base template for the week with all days
      const baseWeekData = generateWeekDates(weekStart);
      
      // Merge the received data with the base template
      const mergedData = baseWeekData.map(baseDay => {
        const matchingDay = data.find(d => d.day === baseDay.day);
        return matchingDay || baseDay;
      });

      setTaskData(mergedData);
    } catch (error) {
      console.error('Error fetching task data:', error);
      // On error, show empty week template
      setTaskData(generateWeekDates(weekStart));
    }
  };

  // ... rest of your code remains the same until the BarChart component ...

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md relative">
      {/* Week Navigation remains the same */}
      <div className="absolute top-4 right-4 flex items-center z-10">
        {/* ... navigation buttons ... */}
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={taskData}
          margin={{ top: 40, right: 0, left: 0, bottom: 0 }}
          barSize={30}
        >
          <CartesianGrid 
            vertical={false} 
            horizontal={true} 
            stroke="#f0f0f0" 
          />
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 10]} // Set fixed domain to 10
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={false}
          />
          <Bar dataKey="completedTasks" 
            stackId="tasks"
            fill="#7851A9"
            animationDuration={500}
          />
          <Bar 
            dataKey="remainingTasks" 
            stackId="tasks"
            fill="#D3B4F5" 
            animationDuration={500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskCompletionChart;