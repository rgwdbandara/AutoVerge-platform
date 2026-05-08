import { SignIn, SignUp } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

function AuthPage() {
  const location = useLocation();
  const isSignup = location.pathname === "/sign-up";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* 🔥 BACKGROUND IMAGE */}
      <img
        src="/car-auth1.jpg"
        alt="car"
        className="absolute inset-0 object-cover w-full h-full"
      />

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* 🔥 CONTENT */}
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">

        {/* LEFT TEXT */}
        <div className="hidden flex-col justify-center px-6 py-14 text-white md:flex lg:w-1/2 lg:px-16">
          <h1 className="mb-4 text-4xl font-bold lg:text-5xl">
            Don’t keep your car waiting
          </h1>
          <p className="max-w-lg text-lg">
            Post it for free. Buyers are looking right now!
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="flex w-full items-center justify-center px-4 py-10 md:px-6 lg:w-1/2">

          <div className="w-full max-w-md rounded-xl bg-white/90 p-6 shadow-xl backdrop-blur-md sm:p-8">

            {isSignup ? <SignUp /> : <SignIn />}

          </div>

        </div>

      </div>
    </div>
  );
}

export default AuthPage;