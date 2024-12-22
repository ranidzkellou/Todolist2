/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState ,useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import TaskSmallCard from './TasksmallCard';


function TimelineSection({ folder, index, onEditTask,onCompleteTask,onDeleteTask }) {

  console.log("folder",folder);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [tasks, setTasks] = useState(folder.tasks);

  useEffect(() => {
    setTasks(folder.tasks)
  }, [folder]); 


  return (
    <div className="w-full rounded-xl transition-all duration-700 ease-in-out">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:scale-125 transition-all duration-300"
        >
          <ChevronDown
            strokeWidth={4}
            color="#0070C0"
            className={`w-5 h-5 transition-transform duration-300 ${
              isExpanded ? 'transform rotate-180' : ''
            }`}
          />
        </button>
        <h2>{folder.emoji}</h2>
        <h3
          className={`text-xl font-bold ${isExpanded ? `text-accent` : `text-bluemain`}`}
        >
          {folder.name}
        </h3>
      </div>

      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex gap-6 pl-4">
          <div className="relative line">
            <div
              className={`absolute top-0 bottom-0 left-1/2 bg-accent w-1 rounded-full transform -translate-x-1/2 transition-all duration-700 origin-top ${
                isExpanded ? 'scale-y-100' : 'scale-y-0'
              }`}
            />
          </div>
          <div className="flex-1 pb-4 space-y-4">
            {tasks && tasks.length > 0 ? (
              tasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`transform transition-all duration-500 ${
                    isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <TaskSmallCard
                    task={task}
                    onCompleteTask={onCompleteTask}
                    onDeleteTask={onDeleteTask}
                    index={index}
                    onEditTask={onEditTask}
                  />
                </div>
              ))
            ) : (
              <div className={`text-center py-4 text-gray-500 italic ${
                isExpanded ? 'opacity-100' : 'opacity-0'
              }`}>
                This folder is empty. Create a task to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimelineSection;
