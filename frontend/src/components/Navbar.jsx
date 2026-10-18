import { LogOut, Search, X } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm =
    location.pathname === "/monitors"
      ? searchParams.get("search") || ""
      : "";

  const handleSearchChange = (event) => {
    const value = event.target.value;

    if (location.pathname !== "/monitors") {
      if (value) {
        navigate(`/monitors?search=${encodeURIComponent(value)}`, {
          replace: true,
        });
      }
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set("search", value);
    } else {
      nextParams.delete("search");
    }
    setSearchParams(nextParams, { replace: true });
  };

  const clearSearch = () => {
    if (location.pathname === "/monitors") {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("search");
      setSearchParams(nextParams, { replace: true });
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          API Monitoring
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search monitors by name or URL..."
            aria-label="Search monitors by name or URL"
            className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm outline-none transition focus:border-gray-300 focus:bg-white"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear monitor search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "M"}
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-gray-500">
              {user?.email || ""}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;