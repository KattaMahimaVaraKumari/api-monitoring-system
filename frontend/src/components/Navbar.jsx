import {Bell, Search, ChevronDown,} from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          API Monitoring
        </h2>

        <p className="text-sm text-gray-500">
          Monitor your APIs and performance
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 md:flex">
          <Search size={17} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search"
            className="w-36 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />

          <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs text-gray-400">
            /
          </span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex cursor-pointer items-center gap-3 border-l border-gray-200 pl-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
            M
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              My Account
            </p>
            <p className="text-xs text-gray-500">
              Developer
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-gray-400 sm:block"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
