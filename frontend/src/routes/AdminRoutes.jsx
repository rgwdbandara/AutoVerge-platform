import { Navigate, Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PendingAds from "../pages/admin/PendingAds";
import AdminCarDetails from "../pages/admin/AdminCarDetails";
import AdminLayout from "../layouts/AdminLayout";
import AdminCars from "../pages/admin/AdminCars";
import AdminSettings from "../pages/admin/AdminSettings";
import ImportedListings from "../pages/admin/ImportedListings";

export const adminRoutes = (
  <>
    <Route
      path="/admin"
      element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="pending" element={<PendingAds />} />
      <Route path="car/:id" element={<AdminCarDetails />} />
      <Route path="cars" element={<AdminCars />} />
      <Route path="imported" element={<ImportedListings />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>
  </>
);
