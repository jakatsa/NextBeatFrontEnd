// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the current user details from the backend.
  const getUserData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/me/", {
        method: "GET",
        credentials: "include", // Sends the HttpOnly cookie with the request
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        return data;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On app load, try to fetch user data to see if the user is logged in.
    getUserData();
  }, []);

  // Login function: calls the login endpoint, then fetches user details.
  const loginUser = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: sends cookies with the request
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        // After a successful login, the backend sets an HttpOnly cookie.
        // Now fetch the user details.
        const userData = await getUserData();

        // Redirect based on the user role using the "role" property.
        const redirectPath =
          userData && userData.role === "producer"
            ? "/ProducerHomePage"
            : "/ClientHomepage";
        navigate(redirectPath);

        Swal.fire({
          title: "Login Successful",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });

        // Optionally, force a page reload to update the UI.
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const data = await response.json();
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

  // Logout function: clears user state and calls the logout endpoint.
  const logoutUser = useCallback(async () => {
    try {
      // Call your logout endpoint (ensure domain consistency)
      await fetch("http://localhost:8000/api/v1/logout/", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
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

  // Register function: calls the registration endpoint and provides feedback.
  // For "client" role, only sends the client-specific fields.
  const registerUser = async (
    bio,
    bank_details,
    contacts,
    name,
    email,
    role,
    user_name,
    password,
    password2
  ) => {
    try {
      let payload = {};
      if (role === "client") {
        // For clients, only include necessary fields.
        payload = {
          name,
          email,
          role,
          user_name,
          password,
          password2,
        };
      } else {
        // For producers, include additional fields.
        payload = {
          bio,
          bank_details,
          contacts,
          name,
          email,
          role,
          user_name,
          password,
          password2,
        };
      }

      const response = await fetch("http://localhost:8000/api/v1/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        Swal.fire({
          title: "Registration Successful",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
        // Optionally navigate to the login page after successful registration
        navigate("/login");
      } else {
        const data = await response.json();
        console.error("Registration error details:", data);
        throw new Error(data.detail || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: "Registration failed",
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

  const contextData = {
    user,
    setUser,
    loginUser,
    logoutUser,
    registerUser, // Added registerUser to the context
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
