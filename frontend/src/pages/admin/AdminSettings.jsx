import { useState } from "react";

function AdminSettings() {
  const [tab, setTab] = useState("general");

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setTab("general")}
          className={`rounded-lg px-4 py-2 ${
            tab === "general" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          General
        </button>

        <button
          onClick={() => setTab("users")}
          className={`rounded-lg px-4 py-2 ${
            tab === "users" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          Admin Users
        </button>
      </div>

      {tab === "general" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900">

          <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Platform Settings</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-300">Ad Expiry Days</label>
              <input className="w-full rounded border border-slate-200 bg-white p-2 text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white" type="number" />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-600 dark:text-slate-300">Approval Mode</label>
              <select className="w-full rounded border border-slate-200 bg-white p-2 text-slate-900 dark:border-white/10 dark:bg-slate-800 dark:text-white">
                <option>Manual</option>
                <option>Auto</option>
              </select>
            </div>

            </div>

          <button className="mt-6 rounded-lg bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
            Save Settings
          </button>
        </div>
      )}

      {tab === "users" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow transition-colors duration-300 dark:border-white/10 dark:bg-slate-900">

          <h2 className="mb-4 font-semibold text-slate-900 dark:text-white">Admin Users</h2>

          <input
            placeholder="Search users..."
            className="mb-4 w-full rounded border border-slate-200 bg-white p-2 text-slate-900 placeholder:text-slate-400 dark:border-white/10 dark:bg-slate-800 dark:text-white"
          />

          <table className="w-full">
            <thead className="text-left text-slate-500 dark:text-slate-400">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t border-slate-200 dark:border-white/10">
                <td className="py-3 text-slate-900 dark:text-white">Nadeesha</td>
                <td>
                  <span className="rounded bg-slate-200 px-2 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    USER
                  </span>
                </td>
                <td>
                  <button className="text-blue-500 transition hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Make Admin</button>
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