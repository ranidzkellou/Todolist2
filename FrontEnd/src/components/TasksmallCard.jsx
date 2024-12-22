/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState,useEffect } from 'react';
import { ChevronDown, Pencil, Trash, Flag, Clock , CalendarClock , TableOfContents, Plus, X  } from 'lucide-react';
import SmallerTask from './SmallerTask';
import EditTask from './EditTask';
import Checkbox from './CheckBox';
import {useAuth} from '../context/AuthProvider';
import PrioritySelect from './PrioritySelector';

function TaskSmallCard({task,index,onEditTask,onDeleteTask}) {

  const {completeTaskFetch} = useAuth();


  console.log("task comp",task);

  var date = task?.deadline?.split('T')[0] || task?.dueDate; 
  var time = task?.deadline?.split('T')[1].split(":").slice(0, 2).join(":") || task?.dueTime;

  const [isChecked, setIsChecked] = useState(task?.status === 'completed' ? true : false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {createSubtaskFetch}=useAuth();

  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtask, setNewSubtask] = useState({
    title: '',
    priority: 'Medium',
    deadline: ''
  });

  const handleAddSubtask = () => {
    const subtaskPayload = {
      ...newSubtask,
      taskId: task.id
    };
    createSubtaskFetch(subtaskPayload);
    setShowAddSubtask(false);
  };

  return (
    <>
      <div
      key={task.id + task.title}
      className="flex w flex-row items-baseline justify-between gap-4 p-2 w-full rounded transition-all duration-200 overflow-hidden">
        <div className={`w-full px-2 py-4 ${isChecked? "bg-gray-300" : "bg-white"} rounded-xl transition-all duration-200 overflow-hidden `}>
          <div className="flex flex-row items-center justify-between">

            <div className="flex items-center gap-2">
              <input 
                id="filter-size-1" 
                value="id" 
                type="checkbox" 
                checked={isChecked}
                onChange={() => {setIsChecked(!isChecked) ; completeTaskFetch(task.id)}}
                className="size-6 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label 
                htmlFor="filter-size-1" 
                className={`flex-grow text-accent text-sm ${isDetailsOpen? "font-bold" : "font-normal"} transition-all duration-200`}
              >
                {task.title} 
              </label>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-7">
                <div className='flex gap-1 items-center'>
                  <Clock size={15} className="text-gray-600" />
                  <span className="text-xs text-gray-600">{time}</span>                  
                </div>

                <div className='flex gap-1 items-center'>
                  <CalendarClock size={15} className="text-gray-600" />
                  <span className="text-xs text-gray-600">{date}</span>      
                </div>

                <div className='flex gap-1 items-center'>
                  <TableOfContents size={15} className="text-gray-600" />
                  <span className="text-xs text-gray-600">{task?.subtasks?.length}</span>
                </div>



              </div>
              <Flag size={16} strokeWidth={3}
                className={(() => {
                  switch (task.priority) {
                    case 'High':
                      return 'stroke-priority-high-bg fill-priority-high-text';
                    case 'Medium':
                      return 'stroke-priority-mid-bg fill-priority-mid-text';
                    case 'Low':
                      return 'stroke-priority-low-bg fill-priority-low-text';
                  }
                })()}
              />

            </div>
          </div>

          <div 
            className={`
              overflow-hidden
              transition-all 
              duration-500 
              ease-in-out 
              origin-top
              ${isDetailsOpen ? 'max-h-96 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'}
            `}
          >
            <div className="w-full h-[2px] bg-blue-300 my-3 rounded-full"></div>
            
            <div className="mt-2 pl-8 space-y-3">
            <div className="transition-all duration-500 delay-100">
              <h3 className="text-sm font-medium text-accent">Categories:</h3>
              <ul className="pl-3 mt-1">
                
              {task.categories && task.categories.length > 0 ? (
              task.categories.map((category, index) => (
              <li key={index} className="text-xs font-light text-gray-700">
                {category}
              </li>
                ))
              ) : (
                <p className="text-xs text-center font-light text-gray-500">No categories added. Press the edit button to add details.</p>
              )}

              </ul>
            </div>

              <div className="transition-all duration-500 delay-200">
                <h3 className="text-sm font-medium text-accent ">Details</h3>
                {task.details && task.details.trim() !== '' ? (
                  <p className="text-xs font-light text-gray-700">{task.details}</p>  
                  
                ) : (
                  <p className="text-gray-500 text-center font-light text-xs">Press the edit button to add details.</p>
                )}
              </div>
              
              <div className="transition-all duration-500 delay-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-accent">Sous-tâche</h3>
                  <button
                    onClick={() => setShowAddSubtask(!showAddSubtask)}
                    className="text-accent hover:text-accent/80 transition-colors"
                  >
                    {showAddSubtask ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {showAddSubtask && (
                  <div className="mb-4 animate-slideDown">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={newSubtask.title}
                        onChange={(e) => setNewSubtask(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Subtask title"
                        className="flex-1 px-3 py-1.5 text-xs bg-gray-100 text-accent rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                      />
                      <input
                        type="time"
                        value={newSubtask.deadline}
                        onChange={(e) => setNewSubtask(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-24 px-2 py-1.5 text-xs bg-gray-100 text-accent rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
                      />
                      <div className="w-32">
                        <PrioritySelect
                          showLabel={false}
                          value={newSubtask.priority}
                          onChange={(value) => setNewSubtask(prev => ({ ...prev, priority: value }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowAddSubtask(false)}
                        className="px-3 py-1 text-xs text-accent hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddSubtask}
                        disabled={!newSubtask.title.trim()}
                        className="px-3 py-1 text-xs bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                )}

                <ul className="pl-3 mt-1 space-y-3 text-xs font-light text-accent">
                  {task.subtasks && task.subtasks.length > 0 ? (
                    task.subtasks.map((subTask, index) => (
                      <li key={index}>
                        <SmallerTask task={subTask} />
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center text-xs">No subtasks</p>
                  )}
                </ul>
              </div>

            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="rounded text-secondary hover:text-accent transition-all duration-200"
          >
            <ChevronDown 
              size={22} 
              className={`transition-transform duration-300 ease-in-out ${isDetailsOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>

          <button
            onClick={()=>setIsEditing(true)} 
            className="rounded text-secondary hover:text-accent transition-all duration-200"
          >
            <Pencil size={17} />
          </button>

          {isEditing && (
                <EditTask setState={setIsEditing} task={task} onEditTask={onEditTask} />
          )}

          <button 
          className="rounded text-secondary hover:text-accent transition-all duration-200"
          onClick={()=>onDeleteTask(task.id)}
          >
            
            <Trash size={17} />
          </button>
        </div>
        
      </div>

    </>
  );
}
export default TaskSmallCard;