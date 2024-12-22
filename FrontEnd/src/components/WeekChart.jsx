/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import CustomTooltip from './CustomTooltip';

function WeekChart({ weekData }) {
  const processWeekData = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const sortedData = [...weekData].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    return sortedData.map(day => ({
      day: daysOfWeek[new Date(day.date).getDay()],
      percentage: day.statistics.totalTasks > 0 
        ? (Number(day.statistics.completed) / Number(day.statistics.totalTasks)) * 100 
        : 0,
      tooltipData: {
        date: day.date,
        totalTasks: Number(day.statistics.totalTasks),
        completed: Number(day.statistics.completed),
        priorities: {
          high: day.statistics.priorities.high,
          medium: day.statistics.priorities.medium,
          low: day.statistics.priorities.low
        }
      }
    }));
  };

  const chartData = processWeekData();

  return (
    <div className="w-full h-[32rem] bg-white rounded-lg py-10">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          
          <XAxis 
            className='font-bold'
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#0190F8' }}
          />
          <YAxis 
            unit="%" 
            ticks={[0,50,100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#0190F8' }}
          />
          <Tooltip content={<CustomTooltip payload={chartData} />} cursor={false} animationDuration={100} />

          <Bar
            barSize={80}
            dataKey="percentage"
            fill="#0190F8"
            radius={[4, 4, 0, 0]}
            background={{ fill: 'none' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeekChart;