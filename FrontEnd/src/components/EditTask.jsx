/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { createPortal } from 'react-dom';
import PrioritySelect from './PrioritySelector';
import TasksList from './TaskList';

    const Input = ({ ...props }) => (
      <input 
        className="w-full px-3 py-2 bg-gray-300/50 text-accent border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    );

    const Textarea = ({ ...props }) => (
      <textarea 
        {...props}
      />
    );


    const Badge = ({ children, priority }) => {
      const priorityStyles = {
        Low: "bg-green-100 text-green-600",
        Medium: "bg-yellow-100 text-yellow-600",
        High: "bg-red-100 text-red-600",
      };
    
      const badgeStyle = priorityStyles[priority] || priorityStyles.Low;
    
      return (
        <span className={`px-2 py-1 text-sm rounded-full ${badgeStyle}`}>
          {children}
        </span>
      );
    };
    
const hideDefaultIcon = {
  '::-webkit-calendar-picker-indicator': {
    display: 'none'
  },
  '::-webkit-time-picker-indicator': {
    display: 'none'
  }
};

function EditTask({setState, task, onEditTask}) {
  
  const [formData, setFormData] = useState({
    title: task.title || '',
    details: task.details || '',
    priority: task.priority || 'Medium',
    deadline: task.deadline?.split('T')[0] || '',
    deadlineTime: task.deadline?.split('T')[1]?.split(':').slice(0, 2).join(':') || '',
    categories: task.categories || ['Work']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const combinedDeadline = `${formData.deadline}T${formData.deadlineTime}:00`;
    
    const updatedTask = {
      ...task,
      ...formData,
      deadline: combinedDeadline,
      lastEdited: new Date().toISOString()
    };
    
    onEditTask(task.id,updatedTask);
    setState(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setState(false);
    }
  };

  const availableCategories = [
    "Personal",
    "Work",
    "Education",
    "Health & Fitness",
    "Finance",
    "Travel",
    "Home",
    "Projects",
    "Non-Categorized"
  ];
  
  
  const [selectedCategories, setSelectedCategories] = useState(task.categories || []);


  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  var [CreateDate, CreateTime] = task.createdAt.split('T');
  CreateTime = CreateTime.split(":").slice(0, 2).join(":");

  var [DeadLineDate, DeadLineTime] = task.deadline.split('T');
  DeadLineTime = DeadLineTime.split(":").slice(0, 2).join(":");

  const [date, time] = task.deadline.split('T');
  const tasktime = time.split(":").slice(0, 2).join(":");

  const handlePriorityChange = (priority) => {
    setFormData(prev => ({
      ...prev,
      priority
    }));
  };


  console.log()

  return createPortal(

    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
         onClick={handleBackdropClick}>

      <div className="flex gap-6 w-full max-w-[50rem] h-fit p-6 bg-white rounded-2xl transition-all duration-500 ">

        <div className="w-2/3 space-y-6">

          <h2 className="text-4xl font-bold text-accent">Edit Task</h2>
          <div className="w-full h-1 bg-secondary mt-5 mb-5 rounded-full"></div>

          <div className="space-y-5">
            <div>
              <label className="block text-2xl font-medium mb-1 text-secondary">Title</label>
              <Input 
               name="title"
               value={formData.title}
               onChange={handleInputChange}
               placeholder="Task title" 
               className="h-full mt-4 w-full resize-none bg-gray-300/50 text-2xl text-gray-800 font-bold px-3 py-2 rounded " 
              />
            </div>

            <div>
              <label className="block text-2xl font-medium mb-1 text-secondary">Details</label>
              <Textarea 
                name="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Task details" 
                className="h-full w-full resize-none bg-gray-200/50 text-gray-700 px-3 py-2 rounded mt-4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Categories</label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      
                      selectedCategories.includes(category)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <PrioritySelect
              showLabel={true}
              value={formData.priority}
              onChange={handlePriorityChange}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1 text-gray-800">Deadline</label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center gap-2 bg-gray-300/50 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-300/70">
                  <Calendar className="h-4 w-4" color='#1AA7FF' />
                  <Input 
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    style={hideDefaultIcon}
                    className="cursor-pointer bg-transparent border-none focus:ring-0 p-0"
                  />
                </label>
                <label className="flex-1 flex items-center gap-2 bg-gray-300/50 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-300/70">
                  <Clock className="h-4 w-4" color='#1AA7FF' />
                  <Input 
                    name="deadlineTime"
                    type="time"
                    value={formData.deadlineTime}
                    onChange={handleInputChange}
                    style={hideDefaultIcon}
                    className="cursor-pointer bg-transparent border-none focus:ring-0 p-0"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
          <button 
          onClick={()=>setState(false)}
    className="px-4 py-2 border border-secondary text-secondary rounded-md transition-all duration-200 hover:bg-accent hover:text-white"
  >
    Cancel
  </button>
  <button 
    className="px-4 py-2 bg-secondary text-white rounded-md transition-all duration-200 hover:bg-accent"
    onClick={handleSubmit}
  >
    Update Task
  </button>
          </div>
        </div>
        <div className="w-1/3 bg-background rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-bluemain">Current Task Info</h3>
          <div className="space-y-4">
            <div>
              <p className="text-base text-accent font-medium">Created</p>
              <p className="text-gray-600 font-normal text-sm" >
                <span>{CreateDate}</span> at <span>{CreateTime}</span>
              </p>
            </div>
            
            <div className='space-y-2'>
              <p className="text-base text-accent font-medium">Deadline</p>
              <p className='text-gray-600 font-normal text-sm'>{DeadLineDate} at {DeadLineTime}</p>
            </div>
            
            <div >
              <p className="text-sm text-accent mb-3">Proprity</p>
              <Badge priority={task.priority}>{task.priority}</Badge>
            </div>
          </div>
        </div>
      </div>

    </div>,

    document.body

  );

};

export default EditTask;