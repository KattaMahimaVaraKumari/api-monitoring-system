import { useEffect, useState } from "react";
import { ArrowLeft, Activity, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";

const MonitorDetails = () => {
  const { id } = useParams();

  const [analytics, setAnalytics] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [analyticsResponse, timeSeriesResponse] = await Promise.all([
          api.get(`/analytics/monitors/${id}`),
          api.get(`/analytics/monitors/${id}/timeseries`),
        ]);

        setAnalytics(analyticsResponse.data.metrics);
        setTimeSeries(timeSeriesResponse.data.events || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load monitor analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">
        Loading monitor analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link
          to="/monitors"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to Monitors
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Checks",
      value: analytics?.totalChecks ?? 0,
      icon: Activity,
    },
    {
      title: "Successful Checks",
      value: analytics?.successfulChecks ?? 0,
      icon: CheckCircle2,
    },
    {
      title: "Uptime",
      value: `${analytics?.uptime ?? 0}%`,
      icon: CheckCircle2,
    },
    {
      title: "Avg. Latency",
      value: `${analytics?.averageLatency ?? 0} ms`,
      icon: Clock3,
    },
    {
      title: "Failed Checks",
      value: analytics?.failedChecks ?? 0,
      icon: AlertTriangle,
    },
    {
      title: "Error Rate",
      value: `${analytics?.errorRate ?? 0}%`,
      icon: AlertTriangle,
    },
  ];

  const chartData = timeSeries.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    latency: item.responseTime,
  }));

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/monitors"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to Monitors
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">
          Monitor Analytics
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Detailed performance information for this monitor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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

                <Icon size={20} className="text-blue-600" />
              </div>

              <p className="mt-4 text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Response Time
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            API response latency over recent checks.
          </p>
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-sm text-gray-500">
            No monitoring data available yet.
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorDetails;
