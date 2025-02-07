import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct the import
import { useNavigate } from "react-router-dom"; // Replace useHistory with useNavigate
import Swal from "sweetalert2"; // Import SweetAlert2 properly

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Use navigate instead of useHistory

  const loginUser = async (email, password) => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      const decodedToken = jwtDecode(data.access); // Decode the token here
      setUser(decodedToken);
      localStorage.setItem("authTokens", JSON.stringify(data));

      // Redirect based on user role
      if (decodedToken.userType === "producer") {
        navigate("/ProducerHomePage");
      } else {
        navigate("/ClientHomepage");
      }

      Swal.fire({
        title: "Login Successful",
        icon: "success",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: "Username or password does not exist",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const registerUser = async (
    image,
    bio,
    bank_details,
    contacts,
    name,
    email,
    username,
    password,
    password2
  ) => {
    const response = await fetch("http://127.0.0.1:8000/api/v1/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        username,
        password,
        password2,
        image,
        bio,
        bank_details,
        contacts,
      }),
    });
    if (response.status === 201) {
      navigate("/login");
      Swal.fire({
        title: "Registration Successful, Login Now",
        icon: "success",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: `An Error Occurred: ${response.status}`,
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
    Swal.fire({
      title: "You have been logged out...",
      icon: "success",
      toast: true,
      timer: 6000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    loginUser,
    logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    }
    setLoading(false);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
