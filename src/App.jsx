import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import { ClientHomepage } from "./components/UserAuth/ClientHomepage";
import { ProducerHomePage } from "./components/UserAuth/ProducerHomePage";
import Register from "./components/UserAuth/Register";
import { Login } from "./components/UserAuth/Login";
import ClientLogin from "./components/UserAuth/ClientLogin";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "../src/context/AuthContext";
import AuthContext from "../src/context/AuthContext";
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

export default function App() {
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
    <AuthProvider>
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

      <Routes>
        <Route path="/" element={<Navigate to="/LandingPage" />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/BeatCard" element={<BeatCard />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Search" element={<SearchResults query={query} />} />
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
          <Route path="/ClientHomepage" element={<ClientHomepage />} />
          <Route path="/ProducerHomePage" element={<ProducerHomePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
