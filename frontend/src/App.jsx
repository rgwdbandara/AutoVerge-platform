import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CarDetails from "./pages/CarDetails";
import BrowseCars from "./pages/BrowseCars";
import SellerDashboard from "./pages/seller/SellerDashboard";
import MyCars from "./pages/seller/MyCars";
import AddCar from "./pages/seller/AddCar";
import EditCar from "./pages/seller/EditCar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />



      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="*"
          element={
            <div className="pt-20">
              <Routes>
                <Route path="/browse" element={<BrowseCars />} />
                <Route path="/create" element={<h1>Create Listing</h1>} />
                <Route path="/dashboard" element={<h1>Dashboard</h1>} />
                <Route path="/cars/:id" element={<CarDetails />} />
                <Route path="/seller/dashboard" element={<SellerDashboard />} />
                <Route path="/seller/cars" element={<MyCars />} />
                <Route path="/seller/add-car" element={<AddCar />} />
                <Route path="/seller/edit-car/:id" element={<EditCar />} />
              </Routes>
            </div>
          }
        />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;