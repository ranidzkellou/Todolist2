/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements
} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import AuthProviderWithRouter from './components/AuthProviderWithRouter'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Tasks from './pages/Tasks'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings.jsx'
import Categories from './pages/Categories';

import {useAuth} from './context/AuthProvider'
import { Navigate } from 'react-router-dom';


const AuthCheck = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <AuthProviderWithRouter>
          <App />
        </AuthProviderWithRouter>
      }
    >
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/login" element={<AuthCheck> <Login /> </AuthCheck>} />
      <Route path="/signup" element={<AuthCheck> <SignUp /> </AuthCheck>} />

    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
