import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ADMIN_EMAILS = [
  "admin@gmail.com",
  "bwathsala24@gmail.com",
  "bwathsala24@gamil.com",
];

function AdminRoute({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" />;

  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase().trim();
  const role = user.publicMetadata?.role;
  const isAdmin = ADMIN_EMAILS.includes(email) || role === "admin";

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;
