import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import useApi from "./useApi";

function App() {
  const api = useApi();

  const loadVehicles = async () => {
    const res = await api("/api/vehicles");
    const data = await res.json();
    console.log("Vehicles:", data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>AutoVerge</h1>

      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton />
        <p>You are logged in ✅</p>
        <button onClick={loadVehicles}>Load Vehicles</button>
      </SignedIn>
    </div>
  );
}

export default App;