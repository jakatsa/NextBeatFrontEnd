import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default PrivateRoute;
