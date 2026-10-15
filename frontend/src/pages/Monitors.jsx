import { useEffect, useState } from "react";
import { Activity, Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  name: "",
  url: "",
  method: "GET",
  expectedStatus: 200,
  interval: 5,
  timeout: 10,
};

const Monitors = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [monitorMetrics, setMonitorMetrics] = useState({});
  const [togglingId, setTogglingId] = useState(null);

  const monitorsPerPage = 5;

  const fetchMonitors = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      const response = await api.get("/monitors");

      const monitorsList = response.data.monitors || [];
      setMonitors(monitorsList);

      const results = await Promise.all(
        monitorsList.map(async (monitor) => {
          try {
            const analyticsResponse = await api.get(
              `/analytics/monitors/${monitor._id}`
            );

            return {
              id: monitor._id,
              uptime: analyticsResponse.data.metrics?.uptime ?? null,
              averageLatency:
                analyticsResponse.data.metrics?.averageLatency ?? null,
              errorRate: analyticsResponse.data.metrics?.errorRate ?? null,
            };
          } catch (error) {
            console.error(
              `Failed to fetch uptime for ${monitor.name}:`,
              error
            );

            return {
              id: monitor._id,
              uptime: null,
              averageLatency: null,
                errorRate: null,
            };
          }
        })
      );

      const metricsMap = {};

      results.forEach((result) => {
        metricsMap[result.id] = {
          uptime: result.uptime,
          averageLatency: result.averageLatency,
          errorRate: result.errorRate,
        };
      });

      setMonitorMetrics(metricsMap);
    } catch (error) {
      console.error("Failed to fetch monitors:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load monitors. Please try again."
      );
    } finally {
      setLoading(false);

      if (showRefreshLoader) {
        setRefreshing(false);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "expectedStatus" ||
        name === "interval" ||
        name === "timeout"
          ? Number(value)
          : value,
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (monitor) => {
    setEditingId(monitor._id);
    setForm({
      name: monitor.name,
      url: monitor.url,
      method: monitor.method,
      expectedStatus: monitor.expectedStatus,
      interval: monitor.interval,
      timeout: monitor.timeout,
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await api.put(`/monitors/${editingId}`, form);
        setSuccess("Monitor updated successfully.");
      } else {
        await api.post("/monitors", form);
        setSuccess("Monitor created successfully.");
      }

      closeForm();
      await fetchMonitors();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save the monitor. Please check your inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (monitor) => {
    setTogglingId(monitor._id);
    setError("");
    setSuccess("");

    try {
      const newActiveState = !monitor.active;

      await api.put(`/monitors/${monitor._id}`, {
        active: newActiveState,
      });

      setMonitors((previous) =>
        previous.map((item) =>
          item._id === monitor._id
            ? { ...item, active: newActiveState }
            : item
        )
      );

      setSuccess(
        newActiveState
          ? "Monitor activated successfully."
          : "Monitor deactivated successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to update monitor status. Please try again."
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    const monitor = monitors.find((item) => item._id === id);

    if (!monitor) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${monitor.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/monitors/${id}`);
      await fetchMonitors();
    } catch (error) {
      console.error("Failed to delete monitor:", error);
    }
  };

  const statusStyles = {
    healthy: "bg-green-50 text-green-700",
    down: "bg-red-50 text-red-700",
    unknown: "bg-gray-100 text-gray-600",
  };

  const filteredMonitors = monitors.filter((monitor) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      monitor.name?.toLowerCase().includes(search) ||
      monitor.url?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      (monitor.status || "unknown") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedMonitors = [...filteredMonitors].sort((a, b) => {
    if (sortBy === "name") {
      return (a.name || "").localeCompare(b.name || "");
    }

    if (sortBy === "recent") {
      return (
        new Date(b.lastCheckedAt || 0).getTime() -
        new Date(a.lastCheckedAt || 0).getTime()
      );
    }

    return 0;
  });

  const totalPages = Math.ceil(
    sortedMonitors.length / monitorsPerPage
  );

  const startIndex = (currentPage - 1) * monitorsPerPage;

  const paginatedMonitors = sortedMonitors.slice(
    startIndex,
    startIndex + monitorsPerPage
  );

  const healthyCount = monitors.filter(
    (monitor) => monitor.status === "healthy"
  ).length;

  const downCount = monitors.filter(
    (monitor) => monitor.status === "down"
  ).length;

  const unknownCount = monitors.filter(
    (monitor) => !monitor.status || monitor.status === "unknown"
  ).length;

  useEffect(() => {
    fetchMonitors();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitors</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor the availability of your APIs.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => fetchMonitors(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Monitor
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Healthy APIs</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {healthyCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Down APIs</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {downCount}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Unknown Status</p>
          <p className="mt-2 text-2xl font-bold text-gray-600">
            {unknownCount}
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search monitors by name or URL..."
          aria-label="Search monitors by name or URL"
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 sm:max-w-md"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter monitors by status"
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400"
        >
          <option value="all">All statuses</option>
          <option value="healthy">Healthy</option>
          <option value="down">Down</option>
          <option value="unknown">Unknown</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort monitors"
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400"
        >
          <option value="name">Name (A–Z)</option>
          <option value="recent">Recently checked</option>
        </select>
      </div>

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Monitor" : "Add New Monitor"}
            </h2>

            <button
              onClick={closeForm}
              className="text-gray-500 hover:text-gray-800"
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Monitor Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Production API"
                  minLength={2}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  API URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://example.com/api"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  HTTP Method
                </label>
                <select
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="GET">GET</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Expected Status Code
                </label>
                <input
                  type="number"
                  name="expectedStatus"
                  value={form.expectedStatus}
                  onChange={handleChange}
                  min={100}
                  max={599}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check Interval (minutes)
                </label>
                <input
                  type="number"
                  name="interval"
                  value={form.interval}
                  onChange={handleChange}
                  min={1}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  name="timeout"
                  value={form.timeout}
                  onChange={handleChange}
                  min={1}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Monitor"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="font-semibold text-gray-900">All Monitors</h2>
          <p className="mt-1 text-sm text-gray-500">
            {monitors.length} monitor
            {monitors.length !== 1 ? "s" : ""} configured
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              onClick={() => fetchMonitors()}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
            <p className="mt-4 text-sm text-gray-500">
              Loading monitors...
            </p>
          </div>
        ) : monitors.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-4 rounded-full bg-blue-50 p-4">
              <Activity size={28} className="text-blue-600" />
            </div>

            <h3 className="font-semibold text-gray-900">
              No monitors yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Add your first API monitor to start tracking its availability
              and response times.
            </p>

            <button
              onClick={openCreateForm}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Add Your First Monitor
            </button>
          </div>
        ) : filteredMonitors.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <h3 className="font-semibold text-gray-900">
              No matching monitors
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              No monitors match your search or selected status.
            </p>

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Monitor</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Interval</th>
                  <th className="px-6 py-4 font-medium">Last Checked</th>
                  <th className="px-6 py-4 font-medium">Uptime</th>
                  <th className="px-6 py-4 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {paginatedMonitors.map((monitor) => (
                  <tr key={monitor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        to={`/monitors/${monitor._id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {monitor.name}
                      </Link>

                      <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                        {monitor.url}
                      </p>

                      <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {monitor.method}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          statusStyles[monitor.status] ||
                          statusStyles.unknown
                        }`}
                      >
                        {monitor.status || "unknown"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      Every {monitor.interval} min
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {monitor.lastCheckedAt
                        ? new Date(monitor.lastCheckedAt).toLocaleString()
                        : "Not checked yet"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p className="mt-2 text-xs text-gray-500">
                        Uptime:{" "}
                        {monitorMetrics[monitor._id]?.uptime == null
                          ? "Unavailable"
                          : `${monitorMetrics[monitor._id].uptime}%`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Average latency:{" "}
                        {monitorMetrics[monitor._id]?.averageLatency == null
                          ? "Unavailable"
                          : `${monitorMetrics[monitor._id].averageLatency} ms`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Error rate:{" "}
                        {monitorMetrics[monitor._id]?.errorRate == null
                          ? "Unavailable"
                          : `${monitorMetrics[monitor._id].errorRate}%`}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleToggleActive(monitor)}
                          disabled={togglingId === monitor._id}
                          className={`text-xs font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${monitor.active
                              ? "text-orange-600 hover:text-orange-700"
                              : "text-green-600 hover:text-green-700"
                            }`}
                          aria-label={`${monitor.active ? "Deactivate" : "Activate"} ${monitor.name}`}
                          title={monitor.active ? "Deactivate monitor" : "Activate monitor"}
                        >
                          {togglingId === monitor._id
                            ? "Updating..."
                            : monitor.active
                              ? "Deactivate"
                              : "Activate"}
                        </button>

                        <button
                          onClick={() => openEditForm(monitor)}
                          className="text-gray-500 hover:text-blue-600"
                          aria-label={`Edit ${monitor.name}`}
                          title="Edit monitor"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(monitor._id)}
                          className="text-gray-500 hover:text-red-600"
                          aria-label={`Delete ${monitor.name}`}
                          title="Delete monitor"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!error && !loading && sortedMonitors.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1}–
              {Math.min(
                startIndex + monitorsPerPage,
                sortedMonitors.length
              )}{" "}
              of {sortedMonitors.length}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Monitors;