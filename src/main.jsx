import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { Provider } from "react-redux";
import App from "./App.jsx";
import store from "./store/Store.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {" "}
        {/* Add this wrapper */}
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
