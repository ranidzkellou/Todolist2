/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TaskDashboard({ selectedDayData }) {



  console.log("selectedDayData ghani",selectedDayData);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const data = selectedDayData ? [
    {
      priority: 'High',
      
      completed: parseInt(selectedDayData?.statistics?.priorities?.high?.completed || 0),
      total: parseInt(selectedDayData?.statistics?.priorities?.high?.total || 0 ),
      notCompleted: parseInt(selectedDayData?.statistics?.priorities?.high?.total || 0 ) - parseInt(selectedDayData?.statistics?.priorities?.high?.completed || 0 ) ,
      colors: {
        completed: '#dc2626',
        notCompleted: '#fca5a5'
      }
    },
    {
      priority: 'Medium',
      completed: parseInt(selectedDayData?.statistics?.priorities?.medium?.completed),
      total: parseInt(selectedDayData?.statistics?.priorities?.medium?.total),
      notCompleted: parseInt(selectedDayData?.statistics?.priorities?.medium?.total) - parseInt(selectedDayData?.statistics?.priorities?.medium?.completed),
      colors: {
        completed: '#f97316',
        notCompleted: '#fed7aa'
      }
    },
    {
      priority: 'Low',
      completed: parseInt(selectedDayData?.statistics?.priorities?.low?.completed),
      total: parseInt(selectedDayData?.statistics?.priorities?.low?.total),
      notCompleted: parseInt(selectedDayData?.statistics?.priorities?.low?.total) - parseInt(selectedDayData?.statistics?.priorities?.low?.completed),
      colors: {
        completed: '#16a34a',
        notCompleted: '#bbf7d0'
      }
    }
  ] : [];

  const PriorityChart = ({ data }) => {
    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const { priority, completed, total, notCompleted } = payload[0].payload;

        var percent = ((completed / total) * 100).toFixed(1) ;
        percent = percent || 0;

        return (
          <div className="bg-white p-4 rounded-lg shadow-lg border">
            <p className="font-medium mb-2" style={{ color: payload[0].payload.colors.completed }}>
              {priority} Priority
            </p>
            <p className="text-gray-600 font-medium">
              Completed: {completed} of {total} tasks
            </p>
            <p className="text-gray-600 font-medium">
              Remaining: {notCompleted}
            </p>
            <p className="font-medium mt-1 text-gray-700">
              {percent}% Complete
            </p>
          </div>
        );
      }
      return null;
    };

    

    let maxValue = Math.max(...data.map(item => item.total));
    if (maxValue % 4 !== 0) {
      maxValue += 4 - (maxValue % 4);
    }

    return (
      <div className="w-full p-0 font-normal m-0 h-[200px]">
        <ResponsiveContainer>
          <BarChart
            
            data={data} 
            layout="vertical"
            margin={{ top: 0, right: 0, bottom: 0, left: 15 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.2)"
              horizontal={false}
            />
            <XAxis 
              type="number"
              domain={[0,maxValue]}
              
              tick={{ fill: '#ffffff' }}
              axisLine={{ stroke: '#ffffff', strokeWidth: 1 }}
              tickLine={{ stroke: '#ffffff' }}
            />
            <YAxis 
              type="category"
              dataKey="priority"
              axisLine={false} 
              tick={{ fill: '#ffffff' }} 
              tickLine={false} 
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
            />
            
            <Bar
              dataKey="completed"
              fill="#98D1FF"  
              background={{ fill: "#1F6FAD" }}  
              isAnimationActive={false}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const TaskMetrics = ({ missed, due, completed }) => {
    return (
      <div className="flex gap-10 mt-3 ml-4 text-lg font-normal max-md:ml-2.5">
        <div>missed :{missed} </div>
        <div>due :{due} </div>
        <div className="basis-auto">completed :{completed} </div>
      </div>
    );
  };

  console.log("called here",selectedDayData?.statistics);

  return (
    <div className="flex bg-bluemain flex-col p-7 mx-auto w-full h-full font-bold leading-none text-white rounded-xl max-md:px-5 max-md:mt-3.5 max-md:max-w-full">
      <div className="self-start text-6xl text-start font-blod">
        {selectedDayData ? formatDate(selectedDayData?.date) : 'Select a date'}
      </div>
      <div className="flex shrink-0 w-full my-7 h-1 bg-accent rounded-full" />

      <div className="flex flex-wrap items-start justify-between h-auto">
        <div className="items-center gap-2 h-full w-max">
          <h1 className="font-light text-2xl">total tasks</h1>
          <p className="font-bold text-[15rem]">{selectedDayData?.statistics?.totalTasks || 0}</p>
        </div>
        <div className="bg-accent rounded-full h-full w-1"></div>
        <div className="flex flex-shrink flex-col items-start basis-3/5 h-full w-full my-auto text-base">
          <div>tasks priority compilation</div>
          <PriorityChart data={data}></PriorityChart>
          <div className="mt-7 text-lg ">tasks accomplishment</div>
          <TaskMetrics missed={selectedDayData?.statistics?.missed || 0} due={selectedDayData?.statistics?.pending || 0} 
          completed={selectedDayData?.statistics?.completed || 0} />
        </div>
      </div>
    </div>
  );
}
