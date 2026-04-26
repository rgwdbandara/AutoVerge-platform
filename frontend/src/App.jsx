import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/Navbar";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Home from "./pages/Home";
import BrowseCars from "./pages/BrowseCars";
import CarDetails from "./pages/CarDetails";
import AuthPage from "./pages/AuthPage";

// Seller Pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import MyCars from "./pages/seller/MyCars";
import AddCar from "./pages/seller/AddCar";
import EditCar from "./pages/seller/EditCar";
import ProfileHome from "./pages/ProfileHome";
import ManageProfile from "./pages/ManageProfile";
import ExpiredAds from "./pages/seller/ExpiredAds";
import PendingAds from "./pages/seller/PendingAds";

// Sell Landing Page
import Sell from "./pages/Sell";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="pt-20">
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseCars />} />
          <Route path="/cars/:id" element={<CarDetails />} />

          {/* Auth */}
          <Route path="/sign-in" element={<AuthPage />} />
          <Route path="/sign-up" element={<AuthPage />} />

          {/* Sell Flow */}
          <Route path="/sell" element={<Sell />} />

          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/add-car" element={<AddCar />} />
          <Route path="/seller/edit-car/:id" element={<EditCar />} />

          {/* Profile Routes - Nested with DashboardLayout */}
          <Route path="/profile" element={<DashboardLayout />}>
            <Route index element={<ProfileHome />} />
            <Route path="manage" element={<ManageProfile />} />
            <Route path="my-cars" element={<MyCars />} />
            <Route path="expired" element={<ExpiredAds />} />
            <Route path="pending" element={<PendingAds />} />
          </Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;