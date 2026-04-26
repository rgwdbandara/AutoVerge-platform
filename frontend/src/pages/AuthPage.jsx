import { SignIn, SignUp } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

function AuthPage() {
  const location = useLocation();
  const isSignup = location.pathname === "/sign-up";

  return (
    <div className="relative w-full h-screen">

      {/* 🔥 BACKGROUND IMAGE */}
      <img
        src="/car-auth1.jpg"
        alt="car"
        className="absolute inset-0 object-cover w-full h-full"
      />

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* 🔥 CONTENT */}
      <div className="relative z-10 flex h-full">

        {/* LEFT TEXT */}
        <div className="flex-col justify-center hidden w-1/2 px-16 text-white md:flex">
          <h1 className="mb-4 text-5xl font-bold">
            Don’t keep your car waiting
          </h1>
          <p className="text-lg">
            Post it for free. Buyers are looking right now!
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="flex items-center justify-center w-full md:w-1/2">

          <div className="bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-xl w-[400px]">

            {isSignup ? <SignUp /> : <SignIn />}

          </div>

        </div>

      </div>
    </div>
  );
}

export default AuthPage;