import { useEffect, useState } from "react";
import { Activity, Clock3, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Analytics = () => {
  const [monitors, setMonitors] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const monitorsResponse = await api.get("/monitors");

      const monitors = monitorsResponse.data.monitors || [];

      setMonitors(monitors);

      const analyticsResults = await Promise.all(
        monitors.map(async (monitor) => {
          try {
            const response = await api.get(
              `/analytics/monitors/${monitor._id}`
            );

            return {
              monitorId: monitor._id,
              metrics: response.data.metrics,
            };
          } catch (error) {
            console.error(
              `Failed to fetch analytics for ${monitor.name}:`,
              error
            );

            return {
              monitorId: monitor._id,
              metrics: null,
            };
          }
        })
      );

      const metricsMap = {};

      analyticsResults.forEach((result) => {
        metricsMap[result.monitorId] = result.metrics;
      });

      setAnalytics(metricsMap);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load analytics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

        <p className="mt-4 text-sm text-gray-500">
          Loading analytics...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          View performance metrics for all your monitored APIs.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      ) : monitors.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <Activity
            size={32}
            className="mx-auto mb-4 text-gray-400"
          />

          <h2 className="font-semibold text-gray-900">
            No monitors available
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Add a monitor first to start viewing analytics.
          </p>

          <Link
            to="/monitors"
            className="mt-5 inline-block rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Go to Monitors
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {monitors.map((monitor) => {
            const metrics = analytics[monitor._id];

            return (
              <div
                key={monitor._id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold text-gray-900">
                      {monitor.name}
                    </h2>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {monitor.url}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      monitor.status === "healthy"
                        ? "bg-green-50 text-green-700"
                        : monitor.status === "down"
                          ? "bg-red-50 text-red-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {monitor.status}
                  </span>
                </div>

                {!metrics ? (
                  <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                    Analytics unavailable for this monitor.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-gray-500">
                        <Activity size={16} />
                        <span className="text-xs">Total Checks</span>
                      </div>
                      <p className="text-xl font-semibold text-gray-900">
                        {metrics.totalChecks}
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-gray-500">
                        <CheckCircle2 size={16} />
                        <span className="text-xs">Uptime</span>
                      </div>
                      <p className="text-xl font-semibold text-green-600">
                        {metrics.uptime}%
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-gray-500">
                        <Clock3 size={16} />
                        <span className="text-xs">Avg Latency</span>
                      </div>
                      <p className="text-xl font-semibold text-gray-900">
                        {metrics.averageLatency} ms
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-gray-500">
                        <AlertCircle size={16} />
                        <span className="text-xs">Error Rate</span>
                      </div>
                      <p className="text-xl font-semibold text-red-600">
                        {metrics.errorRate}%
                      </p>
                    </div>
                  </div>
                )}

                <Link
                  to={`/monitors/${monitor._id}`}
                  className="mt-5 block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View detailed analytics →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Analytics;