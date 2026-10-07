import { useCallback, useEffect, useState } from "react";

import {
  Activity,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [incidents, setIncidents] = useState([]);
  const [monitors, setMonitors] = useState([]);

  const fetchDashboardData = useCallback(
    async (showRefreshLoader = false) => {
      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        }

        const [
          analyticsResponse,
          incidentsResponse,
          monitorsResponse,
        ] = await Promise.all([
          api.get("/analytics/dashboard"),
          api.get("/incidents"),
          api.get("/monitors"),
        ]);

        setMetrics(analyticsResponse.data);
        setIncidents(incidentsResponse.data.incidents || []);
        setMonitors(monitorsResponse.data.monitors || []);
        setError("");
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load dashboard analytics."
        );
      } finally {
        setLoading(false);

        if (showRefreshLoader) {
          setRefreshing(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchDashboardData]);

  const stats = [
    {
      title: "Total APIs",
      value: metrics?.totalApis ?? 0,
      icon: Activity,
    },
    {
      title: "Uptime",
      value: `${metrics?.uptime ?? 0}%`,
      icon: CheckCircle2,
    },
    {
      title: "Avg. Latency",
      value: `${metrics?.averageLatency ?? 0} ms`,
      icon: Clock3,
    },
    {
      title: "Failed Checks",
      value: metrics?.failedChecks ?? 0,
      icon: AlertTriangle,
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Here's an overview of your API performance.
          </p>
        </div>

        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading dashboard analytics...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">
            {error}
          </p>

          <p className="mt-2 text-sm text-red-600">
            Make sure you're logged in and the backend is running.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <Icon
                      size={20}
                      className="text-blue-600"
                    />
                  </div>

                  <h2 className="mt-4 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </h2>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome to Monitorly
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Your dashboard is connected to the backend.
              Your API statistics will appear here as your
              monitors collect data.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Total Checks
                </p>

                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {metrics?.totalChecks ?? 0}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Successful Checks
                </p>

                <p className="mt-2 text-xl font-semibold text-green-600">
                  {metrics?.successfulChecks ?? 0}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Error Rate
                </p>

                <p className="mt-2 text-xl font-semibold text-red-600">
                  {metrics?.errorRate ?? 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="font-semibold text-gray-900">
                Recent Incidents
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest API outages and their current status.
              </p>
            </div>

            {incidents.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <div className="mb-4 rounded-full bg-green-50 p-4">
                  <CheckCircle2
                    size={28}
                    className="text-green-600"
                  />
                </div>

                <h3 className="font-semibold text-gray-900">
                  No recent incidents
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  All monitored APIs are currently running without recorded incidents.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {incidents.slice(0, 5).map((incident) => (
                  <div
                    key={incident._id}
                    className="flex items-center justify-between gap-4 px-6 py-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-lg bg-red-50 p-2">
                        <AlertTriangle
                          size={18}
                          className="text-red-600"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {incident.monitorId?.name || "Unknown Monitor"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {incident.errorMessage ||
                            "API incident detected"}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          incident.status === "open"
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {incident.status}
                      </span>

                      <p className="mt-2 text-xs text-gray-500">
                        {incident.startedAt
                          ? new Date(
                              incident.startedAt
                            ).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="font-semibold text-gray-900">
                Monitor Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Current health of your monitored APIs.
              </p>
            </div>

            {monitors.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="font-medium text-gray-900">
                  No monitors yet
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Add an API monitor to start tracking its health.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {monitors.map((monitor) => (
                  <div
                    key={monitor._id}
                    className="flex items-center justify-between gap-4 px-6 py-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {monitor.name}
                      </p>

                      <p className="mt-1 truncate text-sm text-gray-500">
                        {monitor.url}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Last checked:{" "}
                        {monitor.lastCheckedAt
                          ? new Date(monitor.lastCheckedAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "Never"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          monitor.status === "healthy"
                            ? "bg-green-50 text-green-700"
                            : monitor.status === "down"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            monitor.status === "healthy"
                              ? "bg-green-500"
                              : monitor.status === "down"
                              ? "bg-red-500"
                              : "bg-gray-400"
                          }`}
                        />

                        {monitor.status || "unknown"}
                      </span>

                      <a
                        href={`/monitors/${monitor._id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;