import { Flag } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { useEffect, useState } from 'react';

const DashMin = () => {
  const { fetchTodayData, todayData , folders } = useAuth();

  console.log("todayData", todayData);

  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: {
      total: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    remaining: {
      total: 0,
      high: 0,
      medium: 0,
      low: 0
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTodayData();
      } catch (error) {
        console.error('Error fetching today data:', error);
      }
    };
    loadData();
  }, [folders]);

  const getCompletedTasks = (tasks) => {
    console.log("completed tasks", tasks);
    return {
      total: tasks.filter(task => task.status === 'completed').length,
      high: tasks.filter(task => task.priority === 'high' && task.status === 'completed').length,
      medium: tasks.filter(task => task.priority === 'medium' && task.status === 'completed').length,
      low: tasks.filter(task => task.priority === 'low' && task.status === 'completed').length,
    };
  };
  
  const getRemainingTasks = (tasks) => {
    return {
      total: tasks.filter(task => task.status !== 'pending').length,
      high: tasks.filter(task => task.priority === 'high' && task.status !== 'pending').length,
      medium: tasks.filter(task => task.priority === 'medium' && task.status !== 'pending').length,
      low: tasks.filter(task => task.priority === 'low' && task.status !== 'pending').length,
    };
  };

  useEffect(() => {
    if (todayData) {
      const completedTasks = getCompletedTasks (todayData);
      const remainingTasks = getRemainingTasks(todayData);

      console.log("completedTasks", completedTasks);
      console.log("remainingTasks", remainingTasks);

      todayData.forEach(task => {
        if (task.status === 'completed') {
          completedTasks[task.priority.toLowerCase()]++;
          completedTasks.total++;
        } else {
          remainingTasks[task.priority.toLowerCase()]++;
          remainingTasks.total++;
        }
      });

      setStats({
        totalTasks: todayData.length,
        completed: completedTasks,
        remaining: remainingTasks
      });
    }else {
      setStats({
        totalTasks: 0,
        completed: {
          total: 0,
          high: 0,
          medium: 0,
          low: 0
        },
        remaining: {
          total: 0,
          high: 0,
          medium: 0,
          low: 0
        }
      });
    }

  }, [todayData]);

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completed.total / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="bg-background rounded-xl p-4 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg text-accent font-bold">Today's Progress</h2>
        </div>
        <span className="text-xs text-bluemain bg-white shadow-sm px-2 py-1 rounded-lg">
          {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      </div>

      <div className="relative">
        <div className="text-center mb-2 flex px-4 bg-white shadow-sm rounded-lg justify-between items-center">
          <div className="text-xs text-gray-500 font-medium">
            Completion Rate
          </div>
          <div className="text-4xl font-bold text-bluemain p-2">
            {completionRate}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-sky-200 rounded-full mt-4 mb-6">
          <div 
            className="h-full bg-bluemain rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        {/* Stats sections */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm text-gray-600 font-medium">Total Tasks</span>
            <span className="text-sm font-medium text-gray-800">{stats.totalTasks}</span>
          </div>

          {/* Completed Tasks Section */}
          <div className="bg-white shadow-sm rounded-lg p-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 font-medium">Completed</span>
              <span className="text-sm text-green-600 font-medium">{stats.completed.total}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <Flag size={12} className="text-red-400" />
                  <span className="text-gray-500">High</span>
                </div>
                <span className="text-gray-600">{stats.completed.high}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <Flag size={12} className="text-yellow-400" />
                  <span className="text-gray-500">Medium</span>
                </div>
                <span className="text-gray-600">{stats.completed.medium}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <Flag size={12} className="text-blue-400" />
                  <span className="text-gray-500">Low</span>
                </div>
                <span className="text-gray-600">{stats.completed.low}</span>
              </div>
            </div>
          </div>

          {/* Remaining Tasks Section */}
          <div className="bg-white shadow-sm rounded-lg p-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 font-medium">Remaining</span>
              <span className="text-sm font-medium text-amber-500">{stats.remaining.total}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <Flag size={12} className="text-red-400" />
                  <span className="text-gray-500">High</span>
                </div>
                <span className="text-gray-600">{stats.remaining.high}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <Flag size={12} className="text-yellow-400" />
                  <span className="text-gray-500">Medium</span>
                </div>
                <span className="text-gray-600">{stats.remaining.medium}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <Flag size={12} className="text-blue-400" />
                  <span className="text-gray-500">Low</span>
                </div>
                <span className="text-gray-600">{stats.remaining.low}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashMin;