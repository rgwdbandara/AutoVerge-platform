import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CarDetails from "./pages/CarDetails";
import BrowseCars from "./pages/BrowseCars";

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
              </Routes>
            </div>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;