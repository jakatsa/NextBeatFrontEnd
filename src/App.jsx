import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { ClientHomepage } from "./components/UserAuth/ClientHomepage";
import { ProducerHomePage } from "./components/UserAuth/ProducerHomePage";
import { Register } from "./components/UserAuth/Register";
import { Login } from "./components/UserAuth/Login";
import ClientLogin from "./components/UserAuth/ClientLogin";
import { ProducerLogin } from "./components/UserAuth/ProducerLogin";

import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { BeatCard } from "./components/BeatCard/BeatCard";
import { BeatDetails } from "./components/BeatDetails/BeatDetails";
import { Cart } from "./components/Cart/Cart";
import { CategoryList } from "./components/CategoryList/CategoryList";
import { SearchResults } from "./components/SearchResults/SearchResults";
import CategoryPage from "./components/CategoryPage/CategoryPage";
import { fetchSearchResults } from "./store/SearchSlice";

export default function App() {
  const [query, setQuery] = useState("");
  const searchResults = useSelector((state) => state.search.results);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    dispatch(fetchSearchResults(query));
    navigate("/Search");
    console.log("Search Query:", query);
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
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </div>
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
              <Link
                to="/"
                className="block py-2 pl-3 pr-4 text-blue-700 bg-blue-100 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/Cart"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Cart: {searchResults?.length || 0}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/LandingPage" />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/BeatCard" element={<BeatCard />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Search" element={<SearchResults query={query} />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/ClientLogin" element={<ClientLogin />} />
        <Route path="/ProducerLogin" element={<ProducerLogin />} />
        <Route path="/Register" element={<Register />} />
        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/ClientHomepage" element={<ClientHomepage />} />
          <Route path="/ProducerHomePage" element={<ProducerHomePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
