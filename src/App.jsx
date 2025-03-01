// src/App.jsx
import React, { useState, useContext, Suspense, lazy } from "react";
import { Link, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";

// Lazy load your components
const ClientHomepage = lazy(() =>
  import("./components/UserAuth/ClientHomepage").then((module) => ({
    default: module.ClientHomepage,
  }))
);
const ProducerHomePage = lazy(() =>
  import("./components/UserAuth/ProducerHomePage").then((module) => ({
    default: module.ProducerHomePage,
  }))
);
const Register = lazy(() => import("./components/UserAuth/Register"));
const Login = lazy(() => import("./components/UserAuth/Login"));
const ClientLogin = lazy(() => import("./components/UserAuth/ClientLogin"));
const PrivateRoute = lazy(() => import("./utils/PrivateRoute"));
const RoleBasedRoute = lazy(() => import("./utils/RoleBasedRoute"));
const LandingPage = lazy(() => import("./components/LandingPage/LandingPage"));
const BeatCard = lazy(() => import("./components/BeatCard/BeatCard"));
const BeatDetails = lazy(() => import("./components/BeatDetails/BeatDetails"));
const Cart = lazy(() => import("./components/Cart/Cart"));
const CategoryList = lazy(() =>
  import("./components/CategoryList/CategoryList")
);
const SearchResults = lazy(() =>
  import("./components/SearchResults/SearchResults")
);
const CategoryPage = lazy(() =>
  import("./components/CategoryPage/CategoryPage")
);
const ClientRegistration = lazy(() =>
  import("./components/UserAuth/ClientRegistration")
);
const ProducerRegistration = lazy(() =>
  import("./components/UserAuth/ProducerRegistration")
);
// Lazy load the AllBeats component (assumed to fetch beats and images)
const AllBeats = lazy(() => import("./components/AllBeats/AllBeats"));

import { fetchSearchResults } from "./store/SearchSlice";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";

function AppContent() {
  const { user, logoutUser } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const searchResults = useSelector((state) => state.search.results);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8 mr-3"
              alt="BeatRoot Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              BeatRoot
            </span>
          </Link>

          <div className="flex md:order-2">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </form>
          </div>

          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link to="/" className="block py-2 pl-3 pr-4 text-blue-700">
                Home
              </Link>
            </li>
            <li>
              <Link to="/Cart" className="block py-2 pl-3 pr-4 text-gray-900">
                Cart: {searchResults?.length || 0}
              </Link>
            </li>
            <li>
              <Link to="/ProducerRegistration" className="block py-2 pl-3 pr-4">
                Sell Beats?
              </Link>
            </li>
            <li>
              <Link to="/ClientRegistration" className="block py-2 pl-3 pr-4">
                Buy Beats?
              </Link>
            </li>

            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="block py-2 px-4 text-white bg-red-500 rounded"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/Login" className="block py-2 pl-3 pr-4">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/Register" className="block py-2 pl-3 pr-4">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Wrap your Routes in Suspense to handle lazy loading */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/LandingPage" />} />
          <Route path="/LandingPage" element={<LandingPage />} />
          <Route path="/BeatCard" element={<BeatCard />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Search" element={<SearchResults query={query} />} />
          <Route path="/AllBeats" element={<AllBeats />} />
          <Route path="/" element={<CategoryList />} />
          <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/beat/:id" element={<BeatDetails />} />
          <Route path="/ClientRegistration" element={<ClientRegistration />} />
          <Route
            path="/ProducerRegistration"
            element={<ProducerRegistration />}
          />
          <Route path="/Login" element={<Login />} />
          <Route path="/ClientLogin" element={<ClientLogin />} />
          <Route path="/Register" element={<Register />} />

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
      </Suspense>
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
