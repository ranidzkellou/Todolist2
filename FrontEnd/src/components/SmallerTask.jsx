/* eslint-disable react/prop-types */
import { Flag, Clock } from 'lucide-react';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthProvider';

function SmallerTask({ task }) {

  console.log("subtask", task);

  const { checkSubtaskFetch, deleteSubtaskFetch } = useAuth();
  const [isChecked, setIsChecked] = useState(task?.status === 'completed' ? true : false);

  const handleCheckSubtask = async () => {
    try {
      setIsChecked(!isChecked);
      await checkSubtaskFetch(task.id);
    } catch (error) {
      setIsChecked(isChecked);
      console.error('Error completing subtask:', error);
    }
  };

  const handleDelete = () => {
    deleteSubtaskFetch(task.id);
  };

  const time = task.deadline?.split('T')[1]?.split(":").slice(0, 2).join(":") || "";

  return (
    <div className="flex felx-row my-2 gap-3 justify-between">
      <div className={`w-full p-2 ${isChecked ? 'bg-gray-100' : 'bg-blue-100'} rounded transition-all duration-200 overflow-hidden`}>
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center flex-grow gap-2">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={handleCheckSubtask}
              className="size-4 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className={`text-sm ${isChecked ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
              {task.title}
            </span>
          </div>

          <div className="flex items-center gap-5">
            {time && (
              <div className="flex items-center gap-1">
                <Clock size={8} className="text-gray-600" />
                <span className="text-[0.5rem] text-gray-600">{time}</span>
              </div>
            )}
            
            <Flag size={16} strokeWidth={3}
              className={(() => {
                switch (task.priority) {
                  case 'High':
                    return 'stroke-priority-high-bg fill-priority-high-text';
                  case 'Medium':
                    return 'stroke-priority-mid-bg fill-priority-mid-text';
                  default:
                    return 'stroke-priority-low-bg fill-priority-low-text';
                }
              })()}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={handleDelete}
          className="rounded text-secondary hover:text-accent transition-all duration-200"
        >
          <Trash size={12} />
        </button>
      </div>
    </div>
  );
}

export default SmallerTask;