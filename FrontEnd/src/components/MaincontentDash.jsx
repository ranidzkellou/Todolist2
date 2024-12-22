/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import DataCard from "../components/Datacard";
import WeekChat from "./WeekChart";
import Calendar from "./Calendar";
import TaskDashboard from "./TaskDashboard";
import { AlertCircle, Calendar as cal2, Coffee, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MdPending } from "react-icons/md";

function MaincontentDash({ todayData, monthData, statsData }) {

  console.log("MonthData", monthData);

  const [selectedDate, setSelectedDate] = useState(null);
  const skeleton = {
    days: "",
    date: "",
    isToday: "",
    statstics: {
      completed: "",
      missed: "",
      pending: "",
      priorities: { 
        High: {
          completed: "",
          total: "",
          missed: "",
          pending: ""
        },
        Medium: {
          completed: "",
          total: "",
          missed: "",
          pending: ""
        },
        Low: {
          completed: "",
          total: "",
          missed: "",
          pending: ""
        }
      },
      total_tasks: ""
    }
  }
  const [selectedDayData, setSelectedDayData] = useState(skeleton);
  const [weekData, setWeekData] = useState([]);
  
  const long = todayData.length || 0;
  const getCompletedTasks = (todayData) => {
    return todayData?.filter(task => task.status === 'completed').lenght || 0;
  }

  useEffect(() => {
    if (monthData?.days) {
      const getCurrentWeekData = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const currentWeekDays = monthData.days.filter(day => {
          const dayDate = new Date(day.date);
          return dayDate >= startOfWeek && dayDate <= endOfWeek;
        });
        
        setWeekData(currentWeekDays);
      };

      getCurrentWeekData();
    }
  }, [monthData]);

  useEffect(() => {
    if (monthData?.days && monthData.days.length > 0) {
      const firstDay = new Date(monthData.days[0].date);
      setSelectedDate(firstDay);
      setSelectedDayData(monthData?.days[0]);
    }
  }, [monthData]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const selectedDay = monthData?.days.find(day => {
      const dayDate = new Date(day.date);
      return dayDate.toDateString() === date.toDateString();
    });
    setSelectedDayData(selectedDay);
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });


  return(
    <>
      <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 h-full min-h-screen flex-1 overflow-y-auto flex flex-col w-full bg-background p-4 rounded-xl transition-all duration-200">

        <div className="flex felx-row w-full gap-8 justify-between ">
        <DataCard
          bgIconColor={'bg-sky-400'}
          Icon={cal2}
          total={long || 0}
          completed={getCompletedTasks(todayData) || 0}
          title="Today's Tasks"
        />
        <DataCard
        bgIconColor={'bg-green-400'}
          Icon={Check}
          total={statsData?.total_tasks || 0}
          completed={statsData?.completed_tasks || 0}
          title="Completed Tasks"
        />
        <DataCard
        bgIconColor={'bg-amber-400'}
          Icon={Coffee}
          total={statsData?.total_tasks || 0}
          completed={statsData?.remaining_tasks || 0}
          title="Remaining Tasks"
        />
        <DataCard
        bgIconColor={'bg-red-400'}
          Icon={AlertCircle}
          total={statsData?.total_tasks || 0}
          completed={statsData?.overdue_tasks || 0}
          title="Overdue Tasks"
        />
        </div> 

        <h1 className="text-accent font-bold text-5xl my-14">Résumé de cette semaine</h1>
        <div className="w-full h-auto">      
          <WeekChat weekData={weekData} />
        </div>

        <div className="w-full h-[33rem] text-white flex gap-6 items-center my-10 ">

            <div className="basis-2/5 w-full p-8 h-full bg-bluemain rounded-lg select-none">
              <h1 className="font-bold text-3xl">This month's summary</h1>
              <div className="bg-accent w-full h-1 rounded-full mt-5"></div>
              <div className="flex justify-between items-center my-3">
                <div className="flex flex-col items-center">
                  <h1 className="font-bold text-2xl">{monthData.monthSummary.totalTasks}</h1>
                  <p className="text-sm font-light">total task</p>
                </div>
                <div className="flex flex-col items-center">
                  <h1 className="font-bold text-2xl">{monthData.monthSummary.completedTasks}</h1>
                  <p className="text-sm font-light">completed</p>
                </div>
                <div className="flex flex-col items-center">
                  <h1 className="font-bold text-2xl">{monthData.monthSummary.pendingTasks}</h1>
                  <p className="text-sm font-light">pending</p>
                </div>
              </div>
              <div className="bg-accent w-full h-1 rounded-full"></div>

              <div className="flex flex-col items-center ">

                <div className="mt-4 py-1.5 px-2.5 bg-white w-fit text-accent font-medium rounded-lg text-xl">{currentMonth}</div>
                <Calendar 
                  monthData={monthData}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />                
              </div>

            </div>
            
            <div className="bg-blue-500 w-2 h-full rounded-full"></div>
            <TaskDashboard selectedDayData={selectedDayData} />
            

            
          </div>  

          <br></br>
          <br></br>
      </div>
    </>
  );

}

export default MaincontentDash;