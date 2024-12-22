/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log("ProtectedRoutes", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
