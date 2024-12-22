/* eslint-disable react/prop-types */
import { Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';

const TopBar = ({user}) => {
  const {logOut}  = useAuth();

  return (
    <nav className="w-full bg-bluemain rounded-lg px-2 py-2 h-14 content-center">
      <div className="max-w-9xl mx-auto flex items-center justify-between">

        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">TodoApp</h1>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg text-accent font-light bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-bluemain">
              <Search size={18} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.username}</p>
            <p className="text-xs text-sky-800">{user?.email}</p>
          </div>

          <button
            className="text-white hover:text-red-500 transition-colors"
            onClick={()=>{logOut()}}
          >
            <LogOut size={20} />
          </button>
        </div>
        </div>
      </nav>
  );
};

export default TopBar;