import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and preferences.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <User size={20} className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Account Information
                </h2>
                <p className="text-sm text-gray-500">
                  Your account details.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Name
              </p>
              <p className="mt-1 text-gray-900">
                {user?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Email
              </p>
              <p className="mt-1 text-gray-900">
                {user?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Role
              </p>
              <p className="mt-1 capitalize text-gray-900">
                {user?.role || "user"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-white shadow-sm">
          <div className="border-b border-red-100 px-6 py-5">
            <h2 className="font-semibold text-gray-900">
              Session
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sign out of your Monitorly account.
            </p>
          </div>

          <div className="px-6 py-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;