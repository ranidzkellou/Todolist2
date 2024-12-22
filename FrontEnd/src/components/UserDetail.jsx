/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function UserDetails({user = {}}) {

    //const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      
      await new Promise(resolve => setTimeout(resolve, 500));
       
      localStorage.removeItem('site');
      navigate('/login');
      
    } catch (error) {
      console.error('Logout failed:', error);
    } 
  };

    return (
      <>  
      
        <div className="flex flex-row justify-between items-center mt-3">
            <div className="flex gap-3 items-center">
                
          <img
            alt=""
            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="inline-block size-10 rounded-md ring-2 ring-white h-12 w-auto object-cover "
          />
            <h1 className="font-bold text-accent text-lg ">User name </h1>
            </div>

            <button 
          className="text-black hover:text-gray-800 transition-colors"
          onClick={/*handleLogout()*/ console.log("hello words")}
          aria-label="Logout"
        >

          <LogOut size={15} color='#9DD1F1' />
          
        </button>
        </div>




      </>
    )
  }

  export default UserDetails;
  