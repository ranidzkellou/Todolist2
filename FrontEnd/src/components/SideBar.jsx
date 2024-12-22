/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChartNoAxesColumn, Home, Settings, Pencil, Trash, Smile } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import EmojiPicker from 'emoji-picker-react';

const ContextMenu = ({ x, y, onClose, onEdit, onDelete }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white shadow-lg rounded-lg py-1 w-48 border border-gray-200 z-50"
      style={{ top: y, left: x }}
    >
      <button
        onClick={onEdit}
        className="w-full px-4 py-2 text-left hover:bg-sky-100 flex items-center gap-2"
      >
        <Pencil size={16} />
        <span>Edit Folder</span>
      </button>
      <button
        onClick={onDelete}
        className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-600 flex items-center gap-2 relative group"
      >
        <Trash size={16} />
        <span>Delete Folder</span>
        <div className="absolute hidden group-hover:block left-0 -bottom-12 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
          Deleting this folder will remove all tasks and subtasks inside it
        </div>
      </button>
    </div>
  );
};

const EditFolderModal = ({ folder, onClose, onSave }) => {
  const modalRef = useRef(null);
  const [title, setTitle] = useState(folder.name || '');
  const [emoji, setEmoji] = useState(folder.emoji || '📁');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const onEmojiClick = (emojiData) => {
    setEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Folder</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-white hover:bg-gray-50"
              >
                <span className="text-xl">{emoji}</span>
                <Smile size={16} className="text-gray-500" />
              </button>
              {showEmojiPicker && (
                <div className="absolute mt-1 z-50">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={300}
                    height={400}
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={folder.name || "Enter folder name"}
              className="flex-1 px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ ...folder, name: title, emoji })}
              className="px-4 py-2 bg-bluemain text-white rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { folders, handleEditFolder: editFolder, handleDeleteFolder: deleteFolder } = useAuth();
  const [expandedFolders, setExpandedFolders] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const handleContextMenu = (e, folder) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      folder
    });
  };

  const openEditModal = (folder) => {
    setContextMenu(null);
    setEditModal(folder);
  };

  const confirmDelete = (folder) => {
    if (window.confirm('Are you sure you want to delete this folder?')) {
      deleteFolder(folder.id);
    }
    setContextMenu(null);
  };

  const handleSaveFolder = (updatedFolder) => {
    editFolder(updatedFolder.id, updatedFolder);
    setEditModal(null);
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const toggleTask = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const getPriorityDot = (priority) => {
    const colors = {
      High: 'bg-red-500',
      Medium: 'bg-yellow-500',
      Low: 'bg-green-500'
    };
    return <div className={`w-2 h-2 rounded-full ${colors[priority]}`} />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return ( 
    <div className="w-[32rem] bg-background h-full p-4 rounded-lg text-accent">
      <nav className="space-y-2 mb-4">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `flex items-center space-x-2 px-2 py-2 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-bluemain text-white font-bold"
              : "hover:bg-bluemain hover:text-white hover:font-bold"
          }`
        }
      >
        <Home size={20} />
        <span className="font-medium">Home</span>
      </NavLink>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex items-center space-x-2 px-2 py-2 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-bluemain text-white font-bold"
              : "hover:bg-bluemain hover:text-white hover:font-bold"
          }`
        }
      >
        <ChartNoAxesColumn size={20} />
        <span className="font-medium">Dashboard</span>
      </NavLink>

      <NavLink
        to="/categories"
        className={({ isActive }) =>
          `flex items-center space-x-2 px-2 py-2 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-bluemain text-white font-bold"
              : "hover:bg-bluemain hover:text-white hover:font-bold"
          }`
        }
      >
        <Home size={20} />
        <span className="font-medium">Categories</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex items-center space-x-2 px-2 py-2 rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-bluemain text-white font-bold"
              : "hover:bg-bluemain hover:text-white hover:font-bold"
          }`
        }
      >
        <Settings size={20} />
        <span className="font-medium">Settings</span>
      </NavLink>
      </nav>

      <div className="relative h-[2px] rounded-full bg-accent my-4">
        <div className="absolute inset-0" />
      </div>

      <div className="space-y-2">
        <h1>Quick view</h1>
        {folders && folders.length > 0 ? (
          folders.map(folder => (
            <div key={folder.id} className="relative">
              {expandedFolders[folder.id] && (
                <div className="absolute left-4 rounded-lg top-8 bottom-0 w-[1px] bg-accent transition-all duration-500 ease-in-out" />
              )}
              
              <button
                onClick={() => toggleFolder(folder.id)}
                onContextMenu={(e) => handleContextMenu(e, folder)}
                className="w-full flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-sky-100 transition-all duration-200"
              >
                <div className="transition-transform duration-200" style={{
                  transform: expandedFolders[folder.id] ? 'rotate(90deg)' : 'rotate(0deg)'
                }}>
                  <ChevronRight size={16} />
                </div>
                <span className="mr-2 transform transition-transform duration-200 hover:scale-110">{folder.emoji}</span>
                <span className="font-light">{folder.name}</span>
                <span className="ml-auto text-xs text-gray-500">{folder.tasks?.length || 0}</span>
              </button>
  
              <div className={`ml-6 text-gray-500 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                expandedFolders[folder.id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {folder.tasks && folder.tasks.length > 0 ? (
                  folder.tasks.map(task => (
                    <div key={task.id}>
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="w-full flex items-center space-x-2 px-2 py-1 rounded hover:bg-sky-100 transition-colors duration-200 group"
                      >
                        {getPriorityDot(task.priority)}
                        <span className="text-sm flex-1 text-left">{task.title}</span>
                        <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {formatDate(task.deadline)}
                        </span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 text-gray-400 text-sm">
                    No tasks in this folder yet
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No folders available</p>
          </div>
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onEdit={() => openEditModal(contextMenu.folder)}
          onDelete={() => confirmDelete(contextMenu.folder)}
        />
      )}

      {editModal && (
        <EditFolderModal
          folder={editModal}
          onClose={() => setEditModal(null)}
          onSave={handleSaveFolder}
        />
      )}
    </div>
  );
};

export default Sidebar;