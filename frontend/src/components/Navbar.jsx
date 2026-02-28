import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-gray-200 bg-white/70 backdrop-blur-md">
      <div className="flex items-center justify-between h-16 px-6 mx-auto max-w-7xl">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} className="h-10" />
          <span className="text-lg font-bold text-gray-800">
            AutoVerge
          </span>
        </Link>
        {/* NAV LINKS */}
        <nav className="items-center hidden gap-8 font-medium text-gray-700 md:flex">
          <Link to="/" className="transition hover:text-blue-600">Home</Link>
          <Link to="/browse" className="transition hover:text-blue-600">Browse Cars</Link>
          <Link to="/create" className="transition hover:text-blue-600">Sell Car</Link>
          <Link to="/dashboard" className="transition hover:text-blue-600">Dashboard</Link>
        </nav>
        {/* RIGHT SIDE */}
        <div>
          <SignedOut>
            <SignInButton>
              <button className="px-5 py-2 text-white transition bg-black rounded-full hover:bg-gray-800">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default Navbar;