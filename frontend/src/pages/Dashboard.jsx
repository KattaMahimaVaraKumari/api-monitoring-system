import { useEffect, useState } from "react";

import { Activity, CheckCircle2, Clock3, AlertTriangle,} from "lucide-react";

import api from "../services/api";

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const response = await api.get("/analytics/dashboard");

        setMetrics(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your API performance.
        </p>
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
                  {metrics.totalChecks}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Successful Checks
                </p>

                <p className="mt-2 text-xl font-semibold text-green-600">
                  {metrics.successfulChecks}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Error Rate
                </p>

                <p className="mt-2 text-xl font-semibold text-red-600">
                  {metrics.errorRate}%
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;