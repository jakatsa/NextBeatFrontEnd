// src/utils/RoleBasedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // If user is not logged in, redirect to login page.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user's role is not allowed, redirect to their respective homepage.
  if (!allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === "producer" ? "/ProducerHomePage" : "/ClientHomepage";
    return <Navigate to={redirectPath} />;
  }

  // If allowed, render the children components.
  return children;
};

export default RoleBasedRoute;
