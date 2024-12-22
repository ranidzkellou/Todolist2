/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import {useState}  from "react";
import AuthProvider from "../context/AuthProvider";

const AuthProviderWithRouter = ({ children }) => {
  const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token") ? true : false);

  
  return (
    <AuthProvider navigate={navigate} isAuthenticated ={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
      {children}
    </AuthProvider>
  );
};

export default AuthProviderWithRouter;
