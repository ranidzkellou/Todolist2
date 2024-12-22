/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { X, Plus } from 'lucide-react';

const AddFolder = ({ onAddFolder, onCancel }) => {
  const [folderName, setFolderName] = useState('');
  const [folderEmoji, setFolderEmoji] = useState('📁');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddFolder = () => {
    if (folderName.trim()) {
      onAddFolder({
        name: folderName.trim(),
        emoji: folderEmoji
      });
      setFolderName('');
      setFolderEmoji('📁');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddFolder();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="w-full bg-customBlue-light mx-auto rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Add New Folder</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-2xl bg-customBlue hover:scale-110 transition-transform p-2 rounded-lg hover:bg-customBlue-dark"
            aria-label="Select emoji"
          >
            {folderEmoji}
          </button>
          {showEmojiPicker && (
            <div className="absolute mt-2 z-50" ref={emojiPickerRef}>
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setFolderEmoji(emoji.emoji);
                  setShowEmojiPicker(false);
                }}
                searchPlaceholder="Search emoji..."
              />
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:outline-none 
                   placeholder-gray-400 transition-all"
          maxLength={50}
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg 
                   transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleAddFolder}
          disabled={!folderName.trim()}
          className="px-4 py-2 bg-customBlue-light text-white rounded-lg 
                   hover:bg-bluemain transition-colors font-medium
                   flex items-center gap-2 disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Add Folder
        </button>
      </div>
    </div>
  );
};

export default AddFolder;