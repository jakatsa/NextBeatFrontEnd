import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/Login" />; // Redirect to login if not authenticated
  }

  if (!allowedRoles.includes(user.userType)) {
    return <Navigate to="/" />; // Redirect to home if role not allowed
  }

  return <Outlet />; // Render the nested routes
};

export default PrivateRoute;
