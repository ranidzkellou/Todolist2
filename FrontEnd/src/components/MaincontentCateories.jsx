/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

const CategoryCard = ({ category }) => {
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleTask = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500'
    };
    return colors[priority.toLowerCase()] || 'text-gray-500';
  };

  return (
    <div className="w-full min-h-52 max-h-60 rounded-lg overflow-hidden shadow-sm bg-white flex flex-col">
      <div className="flex items-center bg-bluemain p-4 justify-between">
        <div className='flex flex-col text-start  justify-between w-full'>
          <h3 className="text-xl font-semibold text-start text-white">{category.title}</h3>
          <div className="text-xs text-start gap-3 text-accent flex">
            <p>Total: {category.statistics.total}</p>
            <p>Completed: {category.statistics.completed}</p>
            <p>Pending: {category.statistics.pending}</p>
            <p>Overdue: {category.statistics.overdue}</p>
          </div>
        </div>
      </div>

      <div className="p-4 scrollbar-thin h-full scrollbar-none overflow-y-scroll space-y-2">
        {category.tasks.map(task => (
          <div 
            key={task.id}
            className="border rounded-lg p-3 h-15 text-blue-500 cursor-pointer hover:bg-gray-50 transition-all duration-200"
            onClick={() => toggleTask(task.id)}
          >
            <div className="flex h-full items-center gap-2">
              <ChevronDown 
                size={20}
                className={`transition-transform duration-200 ${
                  expandedTasks[task.id] ? 'rotate-180' : ''
                }`}
              />
              {task.title}
            </div>
            
            <div className={`space-y-2 overflow-hidden transition-all duration-200 ${
              expandedTasks[task.id] ? 'max-h-96 mt-2' : 'max-h-0'
            }`}>
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                  <span>Priority: {task.priority}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Status: {task.status}</span>
                </div>
                {task.details && (
                  <p className="mt-2 text-gray-600 bg-gray-50 p-2 rounded">{task.details}</p>
                )}
                <p className="text-sm text-gray-500">Folder: {task.folder}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MaincontentCateories = () => {
  const [categoriesData, setCategoriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const categoryTitles = [
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategoriesData(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const formatCategoryData = (categoryTitle) => {
    return {
      id: categoryTitles.indexOf(categoryTitle),
      title: categoryTitle,
      tasks: categoriesData?.categories[categoryTitle] || [],
      statistics: categoriesData?.statistics[categoryTitle] || {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0
      }
    };
  };

  return (
    <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 
      h-full min-h-screen flex-1 overflow-y-auto flex flex-col w-full bg-background 
      p-4 rounded-xl transition-all duration-200">
      <h1 className="text-5xl font-bold mb-10 mt-3 text-accent">Categories</h1>
      <div className="flex gap-4">
        <div className="flex flex-col gap-6 basis-1/3">
          {categoryTitles.slice(0, 3).map(title => (
            <CategoryCard key={title} category={formatCategoryData(title)} />
          ))}
        </div>
        <div className="flex flex-col gap-6 basis-1/3">
          {categoryTitles.slice(3, 6).map(title => (
            <CategoryCard key={title} category={formatCategoryData(title)} />
          ))}
        </div>
        <div className="flex flex-col gap-6 basis-1/3">
          {categoryTitles.slice(6, 9).map(title => (
            <CategoryCard key={title} category={formatCategoryData(title)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaincontentCateories;
