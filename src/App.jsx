// src/App.jsx
import React, { useState, useContext } from "react";
import {
  NavLink,
  Link,
  useNavigate,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";

// Import your components and pages
import { ClientHomepage } from "./components/UserAuth/ClientHomepage";
import { ProducerHomePage } from "./components/UserAuth/ProducerHomePage";
import Register from "./components/UserAuth/Register";
import { Login } from "./components/UserAuth/Login";
import ClientLogin from "./components/UserAuth/ClientLogin";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { BeatCard } from "./components/BeatCard/BeatCard";
import { BeatDetails } from "./components/BeatDetails/BeatDetails";
import { Cart } from "./components/Cart/Cart";
import { CategoryList } from "./components/CategoryList/CategoryList";
import { SearchResults } from "./components/SearchResults/SearchResults";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import { fetchSearchResults } from "./store/SearchSlice";
import { ClientRegistration } from "./components/UserAuth/ClientRegistration";
import { ProducerRegistration } from "./components/UserAuth/ProducerRegistration";
import RoleBasedRoute from "./utils/RoleBasedRoute";
import Trial from "./components/Pages/Trial";
import Layout from "./components/styles/Layout";
import { AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";

function AppContent() {
  const { user, logoutUser } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [isMenu, setIsMenu] = useState(false);
  const searchResults = useSelector((state) => state.search.results);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Determine the home route based on user role.
  const homeRoute =
    user && user.role === "producer" ? "/ProducerHomePage" : "/LandingPage";

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    dispatch(fetchSearchResults(query));
    navigate("/Search");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
      Swal.fire({
        title: "Logout failed",
        icon: "error",
        toast: true,
        timer: 6000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 z-50 w-screen h-[12vh] bg-white md:shadow-md shadow-sm">
        {/* Desktop and tablet */}
        <div className="hidden md:flex justify-between items-center px-7 p-2 h-full">
          {/* Logo and Home */}
          <div className="logo flex items-center">
            <NavLink to={homeRoute} className="flex items-center">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                alt="BeatRoot Logo"
                width="40px"
                height="40px"
              />
              <span className="text-2xl font-semibold ml-3">BeatRoot</span>
            </NavLink>
          </div>

          {/* Navlinks */}
          <ul className="flex items-center space-x-8">
            <li>
              <NavLink
                to={homeRoute}
                className={({ isActive }) =>
                  isActive ? "py-2 text-blue-500" : "py-2 text-gray-900"
                }
              >
                Home
              </NavLink>
            </li>

            {/* For producers: show "Buy Beats?" */}
            {user && user.role === "producer" && (
              <li>
                <NavLink
                  to="/ClientRegistration"
                  className={({ isActive }) =>
                    isActive ? "py-2 text-blue-500" : "py-2 text-gray-900"
                  }
                >
                  Buy Beats?
                </NavLink>
              </li>
            )}

            {/* For clients: show Cart, Sell Beats?, and Producers */}
            {user && user.role === "client" && (
              <>
                <li>
                  <NavLink
                    to="/Cart"
                    className={({ isActive }) =>
                      isActive ? "py-2 text-blue-500" : "py-2 text-gray-900"
                    }
                  >
                    Cart: {searchResults?.length || 0}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/ProducerRegistration"
                    className={({ isActive }) =>
                      isActive ? "py-2 text-blue-500" : "py-2 text-gray-900"
                    }
                  >
                    Sell Beats?
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Producers"
                    className={({ isActive }) =>
                      isActive ? "py-2 text-blue-500" : "py-2 text-gray-900"
                    }
                  >
                    Producers
                  </NavLink>
                </li>
              </>
            )}

            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-6 py-1.5 text-white rounded-full"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/Login"
                    className={({ isActive }) =>
                      isActive ? "py-2 text-blue-500" : "py-2 text-gray-900"
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/Register"
                    className={({ isActive }) =>
                      isActive ? "py-2 text-blue-500" : "py-2 text-gray-900"
                    }
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Search */}
          <div className="flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <AiOutlineSearch
                size={22}
                className="absolute top-2 left-3 text-gray-500"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
            </form>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center justify-between md:hidden h-full pl-2 pr-8">
          {/* Logo and Home */}
          <NavLink to={homeRoute} className="flex items-center gap-2">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              alt="BeatRoot Logo"
              width="40px"
              height="40px"
            />
            <span className="text-2xl font-semibold">BeatRoot</span>
          </NavLink>

          {/* Mobile Menu Toggle */}
          <div className="relative">
            <AiOutlineMenu
              size={20}
              onClick={() => setIsMenu(!isMenu)}
              className="cursor-pointer"
            />
            {isMenu && (
              <div className="bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-full inset-x-0 z-50">
                <ul className="flex flex-col p-2">
                  <li className="py-2">
                    <NavLink
                      to={homeRoute}
                      onClick={() => setIsMenu(false)}
                      className={({ isActive }) =>
                        isActive ? "text-blue-500" : "text-gray-900"
                      }
                    >
                      Home
                    </NavLink>
                  </li>

                  {user && user.role === "producer" && (
                    <li className="py-2">
                      <NavLink
                        to="/ClientRegistration"
                        onClick={() => setIsMenu(false)}
                        className={({ isActive }) =>
                          isActive ? "text-blue-500" : "text-gray-900"
                        }
                      >
                        Buy Beats?
                      </NavLink>
                    </li>
                  )}

                  {user && user.role === "client" && (
                    <>
                      <li className="py-2">
                        <NavLink
                          to="/Cart"
                          onClick={() => setIsMenu(false)}
                          className={({ isActive }) =>
                            isActive ? "text-blue-500" : "text-gray-900"
                          }
                        >
                          Cart: {searchResults?.length || 0}
                        </NavLink>
                      </li>
                      <li className="py-2">
                        <NavLink
                          to="/ProducerRegistration"
                          onClick={() => setIsMenu(false)}
                          className={({ isActive }) =>
                            isActive ? "text-blue-500" : "text-gray-900"
                          }
                        >
                          Sell Beats?
                        </NavLink>
                      </li>
                      <li className="py-2">
                        <NavLink
                          to="/Producers"
                          onClick={() => setIsMenu(false)}
                          className={({ isActive }) =>
                            isActive ? "text-blue-500" : "text-gray-900"
                          }
                        >
                          Producers
                        </NavLink>
                      </li>
                    </>
                  )}

                  <li className="py-2">
                    {user ? (
                      <button
                        onClick={() => {
                          setIsMenu(false);
                          handleLogout();
                        }}
                        className="bg-red-500 px-6 py-1.5 text-white rounded-full"
                      >
                        Logout
                      </button>
                    ) : (
                      <>
                        <NavLink
                          to="/Login"
                          onClick={() => setIsMenu(false)}
                          className={({ isActive }) =>
                            isActive ? "text-blue-500" : "text-gray-900"
                          }
                        >
                          Login
                        </NavLink>
                        <NavLink
                          to="/Register"
                          onClick={() => setIsMenu(false)}
                          className={({ isActive }) =>
                            isActive ? "text-blue-500" : "text-gray-900"
                          }
                        >
                          Register
                        </NavLink>
                      </>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Routes */}
      <div className="pt-[12vh]">
        <Routes>
          <Route path="/" element={<Navigate to="/LandingPage" />} />
          <Route
            path="/LandingPage"
            element={
              <Layout>
                <LandingPage />
              </Layout>
            }
          />
          <Route path="/BeatCard" element={<BeatCard />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Search" element={<SearchResults query={query} />} />
          <Route path="/" element={<CategoryList />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/beat/:id" element={<BeatDetails />} />
          <Route path="/ClientRegistration" element={<ClientRegistration />} />
          <Route path="/trial" element={<Trial />} />
          <Route
            path="/ProducerRegistration"
            element={<ProducerRegistration />}
          />
          <Route path="/Login" element={<Login />} />
          <Route path="/ClientLogin" element={<ClientLogin />} />
          <Route path="/Register" element={<Register />} />

          {/* Route for Producers page */}
          <Route path="/Producers" element={<div>Producers List</div>} />

          <Route element={<PrivateRoute />}>
            <Route
              path="/ClientHomepage"
              element={
                <RoleBasedRoute allowedRoles={["client"]}>
                  <ClientHomepage />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/ProducerHomePage"
              element={
                <RoleBasedRoute allowedRoles={["producer"]}>
                  <ProducerHomePage />
                </RoleBasedRoute>
              }
            />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
