/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import { useState, useEffect } from "react";
import TimelineSection from "./CFolder";
import AddTask from "./AddTask";
import AddFolder from "./AddFolder";
import Button from "./Button";
import { ClipboardPlus, FolderPlus } from 'lucide-react';
import CustomDateFilter from "./CustomDateFilter";
import { useAuth } from '../context/AuthProvider';

function Maincontent() {

  const { 
  folders,handleAddFolder,handleCompleteTask, user,
  handleDeleteTask,handleAddTask , DeleteTaskFetch,editTaskFetch } = useAuth();

  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddFolder, setShowAddFolder] = useState(false);

  console.log("calleed here folders11", folders);

  const workCategories = [
    "Meetings",
    "Emails",
    "Deadlines",
    "Project Management",
    "Research",
    "Client Relations",
    "Team Collaboration",
    "Administrative Tasks",
    "Training & Development",
    "Strategic Planning"
  ];

  const AddTaskClick = () => {
    setShowAddTask(true);
  };

  const AddFolderClick = () => {
    setShowAddFolder(true);
  };

  useEffect(() => {
    console.log("Folders updated:", folders);
  }, [folders]);

  const folderNames = folders.map(folder => folder.name);

  return (
    <div className="
    scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100
    h-full min-h-screen flex-1 overflow-y-auto flex flex-col w-full bg-background p-4 rounded-xl transition-all duration-200">
      <div className="items-center flex">
        <h1 className="font-bold text-accent text-5xl my-4"><span className="font-normal">Welcome</span> {user.username}😊</h1>
      </div>

      <div className="gap-6 my-7 flex items-center mt-7 justify-center">
        <Button
          onClick={AddTaskClick}
          children={
            <div className="flex flex-row items-center gap-2">
              <ClipboardPlus size={20} />
              <h1 className="text-lg leading-none">Ajouter une nouvelle tâche</h1>
            </div>
          }
        />
        <div className="w-[0.1rem] h-6 rounded-full bg-secondary"></div>
        <Button
          onClick={AddFolderClick}
          children={
            <div className="flex flex-row items-center gap-2">
              <FolderPlus size={20} />
              <h1 className="text-lg leading-none">Ajouter une nouvelle dossier</h1>
            </div>
          }
        />
      </div>

      <div className="transition-all duration-200 ease-in-out">
        {showAddTask && (
          <AddTask
            onAddTask={handleAddTask}
            setState={setShowAddTask}
            existingCategories={workCategories}
            existingFolders={folderNames}
          />
        )}
      </div>

      <div className="transition-all duration-200 ease-in-out">
        {showAddFolder && (
          <AddFolder
            onAddFolder={handleAddFolder}
            onCancel={() => setShowAddFolder(false)}
          />
        )}
      </div>

      <div className="flex flex-col gap-5 my-10 m items-center justify-center">
        {folders && folders.length > 0 ? (
          folders.map((folder, index) => (
            <TimelineSection
              key={folder.id}
              folder={folder}
              index={index}
              onEditTask={editTaskFetch}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={DeleteTaskFetch}
            />
          ))
        ) : (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-accent mb-2">Start Your Journey with Us!</h2>
            <p className="text-secondary">Create your first folder to begin organizing your tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Maincontent;
