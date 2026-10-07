import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import api from "../services/api";

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/incidents");

      setIncidents(response.data.incidents || []);
    } catch (error) {
      console.error("Failed to fetch incidents:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load incidents. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const getStatusStyle = (status) => {
    if (status === "open") {
      return "bg-red-50 text-red-700";
    }

    return "bg-green-50 text-green-700";
  };

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Incidents
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track API outages and monitor incident resolution.
          </p>
        </div>

        <button
          onClick={fetchIncidents}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="font-semibold text-gray-900">
            Incident History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {incidents.length} incident
            {incidents.length !== 1 ? "s" : ""} recorded
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">{error}</p>

            <button
              onClick={fetchIncidents}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

            <p className="mt-4 text-sm text-gray-500">
              Loading incidents...
            </p>
          </div>
        ) : incidents.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-4 rounded-full bg-green-50 p-4">
              <CheckCircle2
                size={28}
                className="text-green-600"
              />
            </div>

            <h3 className="font-semibold text-gray-900">
              No incidents
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Great! None of your monitored APIs have reported an
              incident yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    Monitor
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Started
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Resolved
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Duration
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {incidents.map((incident) => (
                  <tr
                    key={incident._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-red-50 p-2">
                          <AlertTriangle
                            size={17}
                            className="text-red-600"
                          />
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {incident.monitorId?.name ||
                              "Unknown Monitor"}
                          </p>

                          {incident.errorMessage && (
                            <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                              {incident.errorMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                          incident.status
                        )}`}
                      >
                        {incident.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {incident.startedAt
                        ? new Date(
                            incident.startedAt
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {incident.resolvedAt
                        ? new Date(
                            incident.resolvedAt
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {incident.duration
                        ? `${incident.duration} min`
                        : incident.status === "open"
                          ? "Ongoing"
                          : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Incidents;