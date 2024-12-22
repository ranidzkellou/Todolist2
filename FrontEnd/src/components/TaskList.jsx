/* eslint-disable react/prop-types */
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';


function TasksList({ tasks }) {
    //console.log("Props received in TasksList:", { tasks });
    const [isExpanded, setIsExpanded] = useState(false);

  
    return (
      <>
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg transition-all duration-300"
            >
              <ChevronDown 
                strokeWidth={4}
                color='#0070C0'
                className={`w-5 h-5 transition-transform duration-300 ${
                  isExpanded ? 'transform rotate-180' : ''
                }`} 
              />
            </button>
            <h3 className="text-xl font-bold text-accent">Folder title</h3>
          </div>

          <div 
            className={`overflow-hidden transition-all duration-300 pl-10  ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className={`transform transition-all duration-300 ${
              isExpanded ? 'translate-y-0' : '-translate-y-4'
            }`}>
              <h2 className="text-accent font-medium text-sm text-left">task.title</h2>
              <ul className="mt-3 mb-3">
                <li className="flex items-center space-x-3 pl-5">
                  <div className="text-gray-800 text-[0.5rem]">task.emojissss</div>
                  <span className="text-gray-800 font-lighr text-[0.5rem] font-main">.title</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

          {/* 
        {tasks.map((task, index) => {
          return (
            <div key={task.title + index}>
              <h2 className="text-accent font-bold text-xl text-left">{task.title}</h2>
              <ul className=" mt-3 mb-3 ">
                {task.subtasks.map((subtask, subIndex) => (
                  <li key={subIndex + subtask.title} className="flex items-center space-x-3 pl-5">
                    <div>{task.emoji}</div>
                    <span className="text-gray-800 font-lighr text-xs font-main">{subtask.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}          
          */}



      </>
    );
  }
  
  export default TasksList;
  