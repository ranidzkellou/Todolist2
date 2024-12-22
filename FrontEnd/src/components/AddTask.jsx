/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import PrioritySelect from './PrioritySelector';
import { useAuth } from '../context/AuthProvider';

const AddTask = ({ setState, existingCategories, existingFolders, onAddTask, setFolders }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('📝');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('Select a folder');

  const {handleAddFolder} = useAuth();

  const [taskData, setTaskData] = useState({
    title: '',
    details: '',
    priority: 'Medium',
    dueDate: '',
    dueTime: '',
    categories: [], 
  });

  const [folderEmoji, setFolderEmoji] = useState('📁');
  const [showFolderEmojiPicker, setShowFolderEmojiPicker] = useState(false);

  const handleCategoryChange = (category) => {
    setTaskData(prev => {
      const updatedCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: updatedCategories };
    });
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, {
      id: Date.now(),
      title: '',
      priority: 'Medium',
      time: ''
    }]);
  };

  const removeSubtask = (id) => {
    setSubtasks(subtasks.filter(task => task.id !== id));
  };

  const handleSubtaskChange = (id, field, value) => {
    setSubtasks(subtasks.map(task =>
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const handleInputChange = (field, value) => {
    setTaskData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder = {
      name: newFolderName,
      emoji: folderEmoji,
      tasks: [],
    };

    handleAddFolder(newFolder);

    setSelectedFolder(newFolderName);
    setNewFolderName('');
    setFolderEmoji('📁');
    setShowNewFolder(false);
  };

  const handleSubmit = () => {
    const taskPayload = {
      ...taskData,
      emoji: selectedEmoji,
      subtasks: subtasks.map(subtask => ({
        title: subtask.title,
        priority: subtask.priority,
        deadlineTime: subtask.time,
      })),
      folder: selectedFolder,
    };

    onAddTask(taskPayload);
    setState(false);
  };

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden p-6 space-y-6 transform transition-all duration-300 animate-slideDown">
      <div className="flex items-center gap-4">
        <button
          onClick={''}
          className="text-2xl cursor-default"
        >
          📝
        </button>
        <h2 className="text-xl font-bold text-accent">New Task</h2>
      </div>

      {showEmojiPicker && (
        <div className="absolute mt-2 z-50">
          <EmojiPicker onEmojiClick={(emoji) => {
            setSelectedEmoji(emoji.emoji);
            setShowEmojiPicker(false);
          }} />
        </div>
      )}

      <input
        placeholder="Task title"
        value={taskData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        className="w-full px-4 py-2 text-xs font-bold text-accent bg-gray-100 rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
      />

      <textarea
        placeholder="Task details"
        value={taskData.details}
        onChange={(e) => handleInputChange('details', e.target.value)}
        className="w-full px-4 py-2 h-24 text-xs bg-gray-100 text-accent rounded-lg resize-none focus:ring-2 focus:ring-accent focus:outline-none"
      />

      <div className="space-y-2">
        <PrioritySelect
          showLabel={true}
          value={taskData.priority}
          onChange={(value) => handleInputChange('priority', value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-accent">Due Date & Time</label>
        <div className="flex flex-wrap gap-3">
          <button
            className="flex-1 flex items-center gap-2 text-xs bg-gray-100 rounded-lg px-3 py-2 cursor-pointer"
            onClick={() => document.getElementById('date-input').showPicker()}
          >
            <Calendar size={17} color='#003e78' />
            <input
              id="date-input"
              type="date"
              value={taskData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="bg-transparent focus:outline-none text-accent cursor-pointer w-fit"
            />
          </button>

          <button
            className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 cursor-pointer"
            onClick={() => document.getElementById('time-input').showPicker()}
          >
            <Clock size={20} color='#003e78' />
            <input
              id="time-input"
              type="time"
              value={taskData.dueTime}
              onChange={(e) => handleInputChange('dueTime', e.target.value)}
              className="bg-transparent focus:outline-none text-xs text-accent cursor-pointer w-full"
            />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-accent text-sm font-medium">Categories</label>
        <div className="flex flex-wrap gap-2">
        {existingCategories?.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`
              px-4 py-2 rounded-full text-[0.7rem] transition-all duration-200
              ${taskData.categories.includes(category)
                ? 'bg-accent text-white shadow-md scale-105'
                : 'bg-sky-100 text-accent hover:bg-bluemain hover:text-white'}
              transform hover:-translate-y-0.5
            `}
          >
            {category}
          </button>
        ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-accent text-sm font-medium">Folder</label>
        <div className="flex gap-2">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-100 text-accent rounded-lg focus:ring-2 focus:ring-accent text-sm focus:outline-none"
          >
            <option value="Select a folder">Select a folder</option>
            {existingFolders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowNewFolder(!showNewFolder)}
            className="px-4 py-2 bg-gray-100 text-accent rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showNewFolder ? (
              <X className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </button>
        </div>

        {showNewFolder && (
          <div className="animate-slideDown space-y-3 bg-gray-50 p-3 rounded-lg mt-2">
            <div className="flex gap-2 items-center">
              <div className="relative">
                <button
                  onClick={() => setShowFolderEmojiPicker(!showFolderEmojiPicker)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  {folderEmoji}
                </button>
                {showFolderEmojiPicker && (
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="bg-white rounded-lg shadow-xl">
                      <EmojiPicker
                        onEmojiClick={(emoji) => {
                          setFolderEmoji(emoji.emoji);
                          setShowFolderEmojiPicker(false);
                        }}
                        width={350}
                        height={400}
                      />
                    </div>
                  </div>
                )}
              </div>
              <input
                placeholder="New folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="flex-1 px-3 py-2 bg-white text-accent rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
              />
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-accent">Subtasks</label>
          <button
            onClick={addSubtask}
            className="text-accent hover:text-accent/80 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex gap-2 items-center animate-slideDown"
            >
              <input
                placeholder="Subtask title"
                value={subtask.title}
                onChange={(e) => handleSubtaskChange(subtask.id, 'title', e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-100 text-accent rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
              />
              <input
                type="time"
                value={subtask.time}
                onChange={(e) => handleSubtaskChange(subtask.id, 'time', e.target.value)}
                className="w-28 px-3 py-2 bg-gray-100 text-accent rounded-lg focus:ring-2 focus:ring-accent focus:outline-none"
              />
              <PrioritySelect
                value={subtask.priority}
                onChange={(value) => handleSubtaskChange(subtask.id, 'priority', value)}
              />
              <button
                onClick={() => removeSubtask(subtask.id)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setState(false)}
          className="flex-1 px-4 py-2 text-accent hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          Create Task
        </button>
      </div>
    </div>
  );
};

export default AddTask;