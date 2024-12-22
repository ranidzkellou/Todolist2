/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';
import { IoIosLogIn } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import { LuListTodo } from "react-icons/lu";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.username || !formData.password) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      if (response.data) {
        // Successful registration
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='h-max w-[1100px] mx-auto flex items-center justify-center rounded-lg'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-between max-w-6xl'>
        <div className='relative w-full md:w-1/2 h-[500px]'>
          <video 
            className='w-full h-full bg-slate-500 object-cover' 
            src='https://res.cloudinary.com/dbqf0wq9s/video/upload/v1734689426/LoginVideo_irkxqf.mp4' 
            autoPlay 
            muted 
            loop
          ></video>
          <div className='absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white'>
            <h2 className='text-4xl font-bold mb-4'>BE PRODUCTIVE</h2>
            <p className='text-xl mb-8'>Embrace Change</p>
            <div className='text-center'>
              <Link to='/login'>
                <button className='bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors'>
                  Sign In
                </button>
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
          
          {error && (
            <div className='mb-4 p-2 bg-red-100 text-red-600 text-sm rounded text-center'>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className='space-y-6 max-w-md mx-auto'>
            <div className='space-y-2'>
              <label htmlFor='email' className='block text-gray-700 font-medium'>EMAIL</label>
              <div className='flex items-center bg-white rounded-lg overflow-hidden border'>
                <MdOutlineMailOutline className='mx-3 text-gray-700' />
                <input
                  type='email'
                  id='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter Email'
                  className='w-full bg-white text-accent py-2 px-3 focus:outline-none'
                />
              </div>
            </div>
            
            <div className='space-y-2'>
              <label htmlFor='username' className='block text-gray-700 font-medium'>USERNAME</label>
              <div className='flex items-center bg-white rounded-lg overflow-hidden border'>
                <MdOutlineMailOutline className='mx-3 text-gray-700' />
                <input
                  type='text'
                  id='username'
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='Enter Username'
                  className='w-full bg-white text-accent py-2 px-3 focus:outline-none'
                />
              </div>
            </div>
            
            <div className='space-y-2'>
              <label htmlFor='password' className='block text-gray-700 font-medium'>PASSWORD</label>
              <div className='flex items-center bg-white rounded-lg overflow-hidden border'>
                <FaUserShield className='mx-3 text-gray-700' />
                <input
                  type='password'
                  id='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter Password'
                  className='w-full bg-white text-accent py-2 px-3 focus:outline-none'
                />
              </div>
            </div>
            
            <div className='space-y-4'>
              <button 
                type='submit'
                disabled={isLoading}
                className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400'
              >
                {isLoading ? 'Creating Account...' : (
                  <>
                    Register <IoIosLogIn />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;