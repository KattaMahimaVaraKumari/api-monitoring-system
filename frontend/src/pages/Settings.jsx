import { useState } from "react";
import { Check, KeyRound, LogOut, Pencil, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Settings = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEditName = () => {
    setName(user?.name || "");
    setMessage("");
    setError("");
    setIsEditingName(true);
  };

  const handleCancelName = () => {
    setName(user?.name || "");
    setMessage("");
    setError("");
    setIsEditingName(false);
  };

  const handleSaveName = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    setSavingName(true);
    try {
      await updateProfile(trimmedName);
      setName(trimmedName);
      setIsEditingName(false);
      setMessage("Name updated successfully.");
    } catch (saveError) {
      setError(
        saveError.response?.data?.errors?.[0]?.message ||
          saveError.response?.data?.message ||
          "Unable to update your name. Please try again."
      );
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const response = await api.put("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordMessage(response.data.message || "Password changed successfully.");
    } catch (changeError) {
      setPasswordError(
        changeError.response?.data?.errors?.[0]?.message ||
          changeError.response?.data?.message ||
          "Unable to change your password. Please try again."
      );
    } finally {
      setSavingPassword(false);
    }
  };

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
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="space-y-3">
                  <label
                    htmlFor="profile-name"
                    className="block text-sm font-medium text-gray-500"
                  >
                    Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                    disabled={savingName}
                    className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={savingName}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Check size={16} />
                      {savingName ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelName}
                      disabled={savingName}
                      className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <div className="mt-1 flex items-center gap-3">
                    <p className="text-gray-900">{user?.name || "-"}</p>
                    <button
                      type="button"
                      onClick={handleEditName}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  </div>
                </>
              )}
              {message && (
                <p role="status" className="mt-2 text-sm text-green-700">
                  {message}
                </p>
              )}
              {error && (
                <p role="alert" className="mt-2 text-sm text-red-700">
                  {error}
                </p>
              )}
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

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <KeyRound size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  Change Password
                </h2>
                <p className="text-sm text-gray-500">
                  Choose a new password for your account.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5 px-6 py-6">
            {[
              {
                id: "current-password",
                label: "Current Password",
                key: "currentPassword",
                autoComplete: "current-password",
              },
              {
                id: "new-password",
                label: "New Password",
                key: "newPassword",
                autoComplete: "new-password",
              },
              {
                id: "confirm-new-password",
                label: "Confirm New Password",
                key: "confirmNewPassword",
                autoComplete: "new-password",
              },
            ].map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={field.id}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type="password"
                  value={passwords[field.key]}
                  onChange={(event) => {
                    setPasswords((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }));
                    setPasswordMessage("");
                    setPasswordError("");
                  }}
                  autoComplete={field.autoComplete}
                  required
                  minLength={field.key === "newPassword" ? 6 : undefined}
                  disabled={savingPassword}
                  className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                />
              </div>
            ))}

            {passwordMessage && (
              <p role="status" className="text-sm text-green-700">
                {passwordMessage}
              </p>
            )}
            {passwordError && (
              <p role="alert" className="text-sm text-red-700">
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={16} />
              {savingPassword ? "Updating..." : "Change Password"}
            </button>
          </form>
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