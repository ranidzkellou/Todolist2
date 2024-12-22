/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaUser, FaUserShield } from 'react-icons/fa';
import { LuListTodo } from "react-icons/lu";
import { IoIosLogIn } from "react-icons/io";
import { useAuth } from '../context/AuthProvider';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const {isAuthenticated,loginAction} = useAuth();

  if (isAuthenticated) {
    navigate('/home');
  }


  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    console.log("thiis is called");
    e.preventDefault();

    loginAction(credentials)

  };

  return (
    <div className='h-max w-[1100px] mx-auto flex items-center justify-center rounded-lg'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between max-w-6xl'>
        <div className='relative w-full md:w-1/2 h-[500px]'>
          <video className='w-full h-full bg-slate-500 object-cover' 
          src='https://res.cloudinary.com/dbqf0wq9s/video/upload/v1734689426/LoginVideo_irkxqf.mp4' 
          autoPlay muted loop></video>
          <div className='absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white'>
            <h2 className='text-4xl font-bold mb-4'>BE PRODUCTIVE</h2>
            <p className='text-xl mb-8'>Embrace Change</p>
            <div className='text-center'>
              <Link to='/signup'>
                <button className='bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors'>Sign Up</button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className='w-full md:w-1/2 p-8'>
          <div className='text-center mb-8'>
            <h3 className='text-4xl text-accent font-bold flex items-center justify-center gap-2'>
              TODO LIST <LuListTodo />
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className='space-y-6 max-w-md mx-auto'>
            <div className='space-y-2'>
              <label htmlFor='email' className='block text-gray-700 font-medium'>EMAIL</label>
              <div className='flex items-center bg-white rounded-lg overflow-hidden'>
                <FaUser className='mx-3 text-gray-700' />
                <input type='email' id='email' value={credentials.email} onChange={handleChange} placeholder='Enter Email' 
                  className='w-full bg-white border-none text-accent py-2 px-3 focus:outline-none' />
              </div>
            </div>
            
            <div className='space-y-2'>
              <label htmlFor='password' className='block text-gray-700 font-medium'>PASSWORD</label>
              <div className='flex items-center bg-white border rounded-lg overflow-hidden'>
                <FaUserShield className='mx-3 text-gray-700' />
                <input type='password' id='password' value={credentials.password} onChange={handleChange} placeholder='Enter Password' 
                  className='w-full py-2 px-3 bg-white text-accent border-none focus:outline-none' />
              </div>
            </div>
            
            <div className='space-y-4'>
              <button type='submit'
                className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2'>
                Login <IoIosLogIn />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
