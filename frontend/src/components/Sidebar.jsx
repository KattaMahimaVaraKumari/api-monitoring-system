import {
  Activity,
  LayoutDashboard,
  Monitor,
  ChartNoAxesCombined,
  AlertTriangle,
  KeyRound,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Monitors",
    path: "/monitors",
    icon: Monitor,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: AlertTriangle,
  },
  {
    name: "API Keys",
    path: "/api-keys",
    icon: KeyRound,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#111827] text-white">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <Activity size={23} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight">
            Monitorly
          </h1>
          <p className="text-xs text-gray-400">
            API Monitoring
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Workspace
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-sm font-medium">
            API Health Monitor
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-400">
            Keep track of your APIs in one place.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
