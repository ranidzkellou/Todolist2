/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';

const MainContentSetting = ({updatePassword, deleteAccount, getUserInfo, updateUserInfo, loading, feedback}) => {
  const [userData, setUserData] = useState({});
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [originalData, setOriginalData] = useState(null);
  const [changedFields, setChangedFields] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileFeedback, setProfileFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserInfo();
      if (data) {
        setUserData(data);
        setOriginalData(data);
      }
    };
    fetchData();
  }, [getUserInfo]);

  const checkChangedFields = useCallback(() => {
    if (!originalData) return;
    const changed = new Set();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== originalData[key]) {
        changed.add(key);
      }
    });
    setChangedFields(changed);
  }, [userData, originalData]);

  useEffect(() => {
    checkChangedFields();
  }, [userData, checkChangedFields]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError(''); 
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!userData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!userData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!userData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = 'Invalid email format';
    if (!userData.username?.trim()) newErrors.username = 'Username is required';
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwords.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwords.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwords.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    if (!passwords.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (passwords.newPassword !== passwords.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', userData);

    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors:', validationErrors);
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updateUserInfo(userData);
      if (success) {
        setOriginalData(userData);
        setChangedFields(new Set());
        setProfileFeedback({ type: 'success', message: 'Profile updated successfully' });
      } else {
        setProfileFeedback({ type: 'error', message: 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setProfileFeedback({ type: 'error', message: error.message || 'An error occurred while updating profile' });
    } finally {
      setIsSubmitting(false);
      // Clear feedback after 5 seconds
      setTimeout(() => setProfileFeedback({ type: '', message: '' }), 5000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    console.log('MaincontentSetting.jsx - Password form submitted');
    
    // Basic validation
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      const success = await updatePassword(
        passwords.currentPassword,
        passwords.newPassword
      );

      if (success) {
        // Reset form only if update was successful
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordError('');
      }
    } catch (error) {
      console.error('Password update failed:', error);
      setPasswordError('Failed to update password');
    }
  };

  const handleResetChanges = () => {
    if (window.confirm('Are you sure you want to reset all changes?')) {
      setUserData(originalData);
      setChangedFields(new Set());
      setErrors({});
    }
  };

  const handleDelete = async () => {
    const password = prompt('Please enter your password to confirm account deletion:');
    if (!password) return;

    try {
      await deleteAccount(password);
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const getInputClassName = (fieldName) => {
    let className = " bg-white font-light text-gray-500 shadow-sm mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-200";
    if (errors[fieldName]) {
      className += "border-red-500";
    } else if (changedFields.has(fieldName)) {
      className += " border-amber-500";
    } else {
      className += " border-white ";
    }
    return className;
  };

  // Update the isFormValid function to properly check the form state
  const isFormValid = () => {
    const hasRequiredFields = 
      userData?.firstName?.trim() &&
      userData?.lastName?.trim() &&
      userData?.email?.trim() &&
      userData?.username?.trim();

    // For debugging
    console.log('Form validation:', {
      hasRequiredFields,
      changedFields: changedFields.size,
      userData
    });

    // Return true if we have all required fields and there are changes
    return hasRequiredFields;
  };
 
  return (
      <div className="    h-full min-h-screen flex-1 overflow-y-auto flex flex-col w-full bg-background p-4 rounded-xl transition-all duration-200">
        <div className="p-4 border-b border-sky-100">
          <h1 className="text-xl font-semibold text-sky-800">Settings</h1>
        </div>

        <div className="flex border-b border-sky-100">
          <button
            className={`px-4 py-2 ${activeSection === 'profile' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-gray-600'}`}
            onClick={() => setActiveSection('profile')}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 ${activeSection === 'security' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-gray-600'}`}
            onClick={() => setActiveSection('security')}
          >
            Security
          </button>
        </div>

        <div className="p-6">
          {activeSection === 'profile' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input

                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className={getInputClassName('firstName')}
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-sm">{errors.firstName}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className={getInputClassName('lastName')}
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-sm">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className={getInputClassName('username')}
                />
                {errors.username && (
                  <span className="text-red-500 text-sm">{errors.username}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className={getInputClassName('email')}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>

              <div className="pt-4 flex justify-between">
                {changedFields.size > 0 && (
                  <button
                    type="button"
                    onClick={handleResetChanges}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                  >
                    Reset Changes
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              {profileFeedback.message && (
                <div className={`mt-2 text-sm ${
                  profileFeedback.type === 'success' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {profileFeedback.message}
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className={getInputClassName('currentPassword')}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className={getInputClassName('newPassword')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className={getInputClassName('confirmPassword')}
                  required
                />
                {passwordError && (
                  <span className="text-red-500 text-sm block mt-1">{passwordError}</span>
                )}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
                <button
                  type="submit"
                  disabled={loading.password}
                  className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.password ? 'Updating...' : 'Change Password'}
                </button>
              </div>
              
              {feedback?.message && (
                <div className={`mt-2 ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {feedback.message}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
  );
};

export default MainContentSetting;