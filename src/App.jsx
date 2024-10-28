import { BeatCard } from "./components/BeatCard/BeatCard";
import { BeatDetails } from "./components/BeatDetails/BeatDetails";
import { Cart } from "./components/Cart/Cart";
import { CategoryList } from "./components/CategoryList/CategoryList";
import { LandingPage } from "./components/LandingPage/LandingPage";
import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/LandingPage" />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/BeatCard" element={<BeatCard />} />
        <Route path="/BeatDetails" element={<BeatDetails />} />
        <Route path="/Cart" element={<Cart/>} />
        <Route path="/CategoryList" element={<CategoryList/>} />
      </Routes>
    </Router>
  );
}
