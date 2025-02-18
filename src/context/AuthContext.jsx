import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize state from localStorage
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? jwtDecode(tokens) : null;
  });

  const [loading, setLoading] = useState(true);

  // Effect to update user when authTokens change
  useEffect(() => {
    if (authTokens?.access) {
      try {
        const decodedUser = jwtDecode(authTokens.access);
        setUser(decodedUser);
      } catch (error) {
        console.error("Error decoding token:", error);
        logoutUser();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [authTokens]);

  // Login Function
  const loginUser = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem("authTokens", JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));

        // Redirect user based on role
        const redirectPath =
          jwtDecode(data.access).userType === "producer"
            ? "/ProducerHomePage"
            : "/ClientHomepage";
        navigate(redirectPath);

        // Show success message
        Swal.fire({
          title: "Login Successful",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // 🔹 Force a full page reload to refresh UI
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error(data.detail || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        title: "Login failed",
        text: error.message,
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  // Logout Function
  const logoutUser = useCallback(() => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");

    Swal.fire({
      title: "You have been logged out",
      icon: "success",
      toast: true,
      timer: 6000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }, [navigate]);

  // Persist tokens in localStorage
  useEffect(() => {
    if (authTokens) {
      localStorage.setItem("authTokens", JSON.stringify(authTokens));
    } else {
      localStorage.removeItem("authTokens");
    }
  }, [authTokens]);

  // Provide context
  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
