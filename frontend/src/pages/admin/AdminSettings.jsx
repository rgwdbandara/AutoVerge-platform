import { useState } from "react";

function AdminSettings() {
  const [tab, setTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setTab("general")}
          className={`rounded-lg px-4 py-2 ${
            tab === "general" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          General
        </button>

        <button
          onClick={() => setTab("users")}
          className={`rounded-lg px-4 py-2 ${
            tab === "users" ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          Admin Users
        </button>
      </div>

      {tab === "general" && (
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 font-semibold">Platform Settings</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <div>
              <label className="block mb-1 text-sm">Ad Expiry Days</label>
              <input className="w-full rounded border p-2" type="number" />
            </div>

            <div>
              <label className="block mb-1 text-sm">Approval Mode</label>
              <select className="w-full rounded border p-2">
                <option>Manual</option>
                <option>Auto</option>
              </select>
            </div>

            </div>

          <button className="mt-6 rounded-lg bg-black px-6 py-2 text-white">
            Save Settings
          </button>
        </div>
      )}

      {tab === "users" && (
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 font-semibold">Admin Users</h2>

          <input
            placeholder="Search users..."
            className="mb-4 w-full rounded border p-2"
          />

          <table className="w-full">
            <thead className="text-left text-gray-500">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td className="py-3">Nadeesha</td>
                <td>
                  <span className="rounded bg-gray-200 px-2 py-1 text-sm">
                    USER
                  </span>
                </td>
                <td>
                  <button className="text-blue-500">Make Admin</button>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}

export default AdminSettings;