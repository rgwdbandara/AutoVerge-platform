import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/browse" element={<h1>Browse Cars</h1>} />
        <Route path="/create" element={<h1>Create Listing</h1>} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;