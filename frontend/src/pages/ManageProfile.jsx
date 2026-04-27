import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../lib/api";

function ManageProfile() {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const api = useApi();
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");

  const getFallbackName = (profileName, clerkUser, userEmail) => {
    if (profileName && profileName.trim()) return profileName;
    if (clerkUser?.fullName && clerkUser.fullName.trim()) return clerkUser.fullName;
    if (clerkUser?.firstName && clerkUser.firstName.trim()) return clerkUser.firstName;
    if (clerkUser?.username && clerkUser.username.trim()) return clerkUser.username;
    if (userEmail && userEmail.includes("@")) return userEmail.split("@")[0];
    return "";
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await api("/api/users/me");
        const userEmail = profile?.email || user?.primaryEmailAddress?.emailAddress || "";

        setEmail(userEmail);
        setPhone(profile?.phone || "");
        setName(getFallbackName(profile?.name, user, userEmail));
        setDistrict(profile?.location?.district || "");
        setCity(profile?.location?.city || "");
      } catch (err) {
        console.error("Failed to load profile:", err);
        const userEmail = user?.primaryEmailAddress?.emailAddress || "";
        setEmail(userEmail);
        setName(getFallbackName("", user, userEmail));
      }
    };

    if (isLoaded && user) {
      loadProfile();
    }
  }, [api, isLoaded, user]);

  const handleUpdateDetails = async () => {
    setSaving(true);
    try {
      await api("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({
          name,
          phone,
          location: {
            district,
            city,
          },
        }),
      });

      alert("Profile updated successfully");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      // Delete user profile from backend
      await api("/api/users/me", { method: "DELETE" });
      
      // Delete Clerk account
      await user.delete();
      
      // Redirect to home
      navigate("/");
    } catch (err) {
      console.error("Account deletion error:", err);
      alert("Failed to delete account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div>

      {/* ONLY CONTENT — NO SIDEBAR */}
      <h2 className="mb-6 text-2xl font-semibold">Change Details</h2>

      <div className="grid grid-cols-2 gap-6">

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">Email</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={email}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border rounded-md"
            />
            <button className="px-5 py-3 text-white bg-gray-500 rounded-md">
              Update
            </button>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">Phone</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={phone}
              placeholder="Add Mobile Number"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border rounded-md"
            />
            <button className="px-5 py-3 text-white bg-gray-500 rounded-md">
              Update
            </button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-md"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">Location</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-4 py-3 border rounded-md"
          >
            <option value="">Select district</option>
            <option value="Colombo">Colombo</option>
            <option value="Kandy">Kandy</option>
            <option value="Galle">Galle</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Jaffna">Jaffna</option>
          </select>
        </div>

        {/* Sub Location */}
        <div className="col-span-2">
          <label className="block mb-1 text-sm text-gray-600">
            Sub Location
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 border rounded-md"
          >
            <option value="">Select sub location</option>
            <option value="Colombo 01">Colombo 01</option>
            <option value="Colombo 03">Colombo 03</option>
            <option value="Maharagama">Maharagama</option>
            <option value="Kandy City">Kandy City</option>
            <option value="Peradeniya">Peradeniya</option>
          </select>
        </div>

      </div>

      <button
        onClick={handleUpdateDetails}
        disabled={saving}
        className="px-6 py-3 mt-6 font-semibold text-black bg-yellow-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Updating..." : "Update Details"}
      </button>

      {/* PASSWORD */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Change Password</h2>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="text-sm text-gray-600">Current Password</label>
            <input className="w-full px-4 py-3 mt-1 border rounded-md" />
          </div>

          <div>
            <label className="text-sm text-gray-600">New Password</label>
            <input className="w-full px-4 py-3 mt-1 border rounded-md" />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Confirm New Password
            </label>
            <input className="w-full px-4 py-3 mt-1 border rounded-md" />
          </div>

        </div>

        <button className="px-6 py-3 mt-6 text-black bg-yellow-500 rounded-md">
          Change Password
        </button>
      </div>

      {/* DANGER ZONE */}
      <div className="pt-8 mt-12 border-t border-gray-300">
        <h2 className="mb-6 text-lg font-semibold text-red-600">Account Settings</h2>

        <div className="flex gap-4">
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="px-6 py-3 font-semibold text-white transition rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>

          <button
            onClick={() => signOut(() => navigate("/"))}
            disabled={deleting}
            className="px-6 py-3 font-semibold text-white transition bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Logout
          </button>
        </div>
      </div>

    </div>
  );
}

export default ManageProfile;