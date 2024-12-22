/* eslint-disable no-unused-vars */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MaincontentSetting from "../components/MaincontentSetting";
import DashMin from "../components/DashMin";
import Notification from '../components/Message';
import axios from 'axios';

import {useAuth} from '../context/AuthProvider';

function Settings() {
  const {call, setCall} = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    password: false,
    delete: false,
    info: false
  });
  const [feedback, setFeedback] = useState({
    type: '',
    message: ''
  });

  const showFeedback = useCallback((type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
  }, []);

  const updatePassword = async (currentPassword, newPassword) => {
    console.log('Settings.jsx - updatePassword called:', { currentPassword, newPassword });
    
    if (!currentPassword || !newPassword) {
      showFeedback('error', 'Both passwords are required');
      return false;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/user/update-password',
        { 
          oldPassword: currentPassword, 
          newPassword 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      showFeedback('success', 'Password updated successfully');
      return true;
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to update password');
      return false;
    }
  };

  const deleteAccount = async (password) => {
    const confirmed = window.confirm(
      'Are you absolutely sure you want to delete your account?\nThis action cannot be undone and all your data will be permanently lost.'
    );

    if (!confirmed) return;

    setLoading(prev => ({ ...prev, delete: true }));
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/user/delete-account', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { password }
      });
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const updateUserInfo = async (userInfo) => {
    console.log('Attempting to update user info:', userInfo);
    setLoading(prev => ({ ...prev, info: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/user/update-info', 
        userInfo,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setCall(!call);
      if (response.status >= 200 && response.status < 300) {
        showFeedback('success', response.data.message || 'Profile updated successfully');
        return true;
      } else {
        showFeedback('error', response.data.message || 'Failed to update profile');
        return false;
      }
    } catch (err) {
      console.error('Update failed:', err.response?.data || err);
      showFeedback('error', err.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(prev => ({ ...prev, info: false }));
    }
  };

  const getUserInfo = useCallback(async () => {
    setLoading(prev => ({ ...prev, info: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/user/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (err) {
      showFeedback('error', 'Failed to fetch user information');
      return null;
    } finally {
      setLoading(prev => ({ ...prev, info: false }));
    }
  }, []);

  return (
    <div className="flex gap-3 self-start flex-row h-full w-full grow-0 mt-3 overflow-hidden">
      <MaincontentSetting 
        updatePassword={updatePassword}
        deleteAccount={deleteAccount}
        updateUserInfo={updateUserInfo}
        getUserInfo={getUserInfo}
        loading={loading}
        feedback={feedback}
      />
      <div className="h-max w-[20%] space-y-3">
        <DashMin />
        <Notification />          
      </div>
    </div>
  );
}

export default Settings;
