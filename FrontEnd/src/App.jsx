import './App.css'
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from './context/AuthProvider';
import Sidebar from './components/SideBar';
import TopBar from './components/Topbar';

function App() {
  const location = useLocation();
  const { user} = useAuth();
  console.log("user first33244, ", user);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  
  const center = (isAuthPage) => {
    if (isAuthPage == true) {
      return "bg-[#AED0FB] h-fit mx-auto my-auto rounded-lg scale-150 overflow-hidden";
    }
    return "w-full h-full";
  }

  return (
    <>
      <div className="flex gap-3 pt-3 h-screen overflow-auto items-start">
        {!isAuthPage && <Sidebar />}
        <div className={"flex flex-col "+ center(isAuthPage)}>
          {!isAuthPage && <TopBar user={user} />}
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default App
