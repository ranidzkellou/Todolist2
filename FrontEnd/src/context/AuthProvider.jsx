/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, createContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from 'axios';

const AuthContext = createContext();

const BASE_URL = "endpoint"; 

const AuthProvider = ({ children, navigate,isAuthenticated,setIsAuthenticated }) => {
  
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [folders, setFolders] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);
  const [todayData, setTodayData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [call,setCall] = useState(false);


  console.log("auth",isAuthenticated)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      
      try {
        const foldersResponse = await axios.get('http://localhost:5000/api/folders/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("folders after fetch", foldersResponse.data);
        setFolders(foldersResponse.data);

        const userResponse = await axios.get('http://localhost:5000/api/user/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(userResponse.data.user);
        localStorage.setItem("user", JSON.stringify(userResponse.data.user)); 
        
        
      } catch (error) {
        console.error('Error fetching data33333:', error);
        logOut()
      }
    };

    fetchData();
    fetchNotifications();
    setIsLoading(false);
  }, [token]);

  const loginAction = async (data) => {
    console.log("data logging",data);

    console.log("token", localStorage.getItem("token"));

    if(localStorage.getItem("token")) {
      console.log("token exists");
      setIsAuthenticated(true);
      <Navigate to="/home" />
    };

    console.log("called login");

    try {
      console.log("login called22222");
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      
      if (!response.ok) {
        throw new Error(res.message || "Login failed");
      } 

      console.log("token  callsssss",res.token);

      if (res.token) {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        console.log("local storage", localStorage.getItem("token"));

        console.log(res);
        setIsAuthenticated(true);
        <Navigate to="/home" />
        return;
      }
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = () => {
    console.log("called logout");
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };


  const handleEditFolder = async (folderId, updatedFolder) => {
    console.log(folderId);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/folders/${folderId}`, 
        updatedFolder, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId ? { ...folder, ...updatedFolder } : folder
        )
      );
      return response.data;
    } catch (e) {
      console.error('Error editing folder:', e);
      throw e;
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await axios.delete(`http://localhost:5000/api/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFolders(prev => prev.filter(folder => folder.id !== folderId));
    } catch (e) {
      console.error('Error deleting folder:', e);
      throw e;
    }
  };

  const handleAddTask = (newTask) => {
    setFolders((prevFolders) => {

      const existingFolder = prevFolders.find((folder) => folder.name === newTask.folder);

      if (existingFolder) {
        return prevFolders.map((folder) =>
          folder.name === newTask.folder
            ? { ...folder, tasks: [...folder.tasks, newTask] }
            : folder
        );
      } else {
        const newFolder = {
          id: prevFolders.length + 1,
          title: newTask.folder,
          emoji: newTask.emoji,
          details: newTask.details,
          tasks: [newTask],
        };
        return [...prevFolders, newFolder];
      }
    });

    
  
    addTaskFetch(newTask);
  };
  
  const addTaskFetch = async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/tasks/create', newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (e) {
      console.error('Error adding task:', e);
    }
  };
  
  const DeleteTaskFetch = async (taskId) => {
    console.log("delete called", taskId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
    } catch (e) {
      console.error('Error deleting task:', e);
    }

    setFolders((prevFolders) => {
      return prevFolders.map((folder) => ({
        ...folder,
        tasks: folder.tasks.filter((task) => task.id !== taskId),
        }));
      }
    );
  };
  
  const completeTaskFetch = async (taskId) => {

    console.log("called change", taskId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/tasks/complete/${taskId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setCall(!call);
    } catch (e) {
      console.error('Error completing task:', e);
    }

    setFolders((prevFolders) => {
      return prevFolders.map((folder) => ({
        ...folder,
        tasks: folder.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        ),
      }));
    });
    
  };

  const editTaskFetch = async (taskId, updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      setFolders((prevFolders) => {
        return prevFolders.map((folder) => ({
          ...folder,
          tasks: folder.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: true } : task
          ),
        }));
      });

      

    } catch (e) {
      console.error('Error editing task:', e);
    }
  }
  
  const handleAddFolder = (newFolder) => {

    console.log("new folder shit", newFolder);

    const newsend = {
      name: newFolder.name,
      emoji: newFolder.emoji,
      user_id: user.id,
    };

    setFolders((prevFolders) => {
      const newFolderWithId = {
        ...newFolder,
        user_id:user.id,
      };
      return [...prevFolders, newFolderWithId];
    });
    addFolderFetch(newsend);
  };
  
  const addFolderFetch = async (newFolder) => {
    console.log("new folder things", newFolder);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/folders/create', newFolder, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFolder),
      });
      console.log(response.data);
    } catch (e) {
      console.error('Error adding folder:', e);
    }
  };
  
const fetchTodayData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/today', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodayData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching today data:', error);
      throw error;
    }
  };  

  const fetchMonthData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/month', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMonthData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching month data:', error);
      throw error;
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/stats/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatsData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  };

  

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkSubtaskFetch = async (subTaskId) => {
    console.log("called check for subtask:", subTaskId);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/subtasks/complete/${subTaskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setCall(!call); // Trigger re-render
    } catch (e) {
      console.error('Error completing subtask:', e);
    }
  
    // Update state by marking the subtask as completed
    setFolders((prevFolders) => {
      return prevFolders.map((folder) => ({
        ...folder,
        tasks: folder.tasks.map((task) => ({
          ...task,
          subtasks: task.subtasks.map((subtask) =>
            subtask.id === subTaskId ? { ...subtask, completed: true } : subtask
          ),
        })),
      }));
    });
  };
  
  
  const deleteSubtaskFetch = async (subTaskId) => {
    console.log("called delete for subtask:", subTaskId);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5000/api/subtasks/${subTaskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setCall(!call); // Trigger re-render
    } catch (e) {
      console.error('Error deleting subtask:', e);
    }
  
    // Update state by removing the subtask
    setFolders((prevFolders) => {
      return prevFolders.map((folder) => ({
        ...folder,
        tasks: folder.tasks.map((task) => ({
          ...task,
          subtasks: task.subtasks.filter((subtask) => subtask.id !== subTaskId), // Remove the matching subtask
        })),
      }));
    });
  };

  const createSubtaskFetch = async (subtaskData) => {
    console.log("called create with subtask data:", subtaskData);
    let response = null;

    try {
      const token = localStorage.getItem('token');
      response = await axios.post(
        `http://localhost:5000/api/subtasks/create`,
        subtaskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Subtask created:", response.data);
      setCall(!call); 
    } catch (e) {
      console.error("Error creating subtask:", e);
    }

    setFolders((prevFolders) => {
      return prevFolders.map((folder) => ({
        ...folder,
        tasks: folder.tasks.map((task) =>
          task.id === subtaskData.taskId
            ? {
                ...task,
                subtasks: [...task.subtasks, { ...subtaskData, id: response.data.id }],
              }
            : task
        ),
      }));
    });
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider 
      value={{ 
        folders,
        createSubtaskFetch,
        setFolders,
        token, 
        user, 
        setCall,
        loginAction, 
        logOut,
        checkSubtaskFetch,
        deleteSubtaskFetch,
        handleEditFolder,
        handleDeleteFolder,
        handleAddTask,
        DeleteTaskFetch,
        completeTaskFetch,
        editTaskFetch,
        handleAddFolder,
        isAuthenticated: !!token,
        todayData,
        monthData,
        statsData,
        fetchMonthData,
        fetchTodayData,
        fetchStats,
        fetchNotifications,
        notifications,
        loading,
        fetchCategories,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  console.log("callled");
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};