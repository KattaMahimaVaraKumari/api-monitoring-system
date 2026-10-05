import { useEffect, useState } from "react";
import { KeyRound, Plus, Copy, Trash2, Check } from "lucide-react";
import api from "../services/api";

const ApiKeys = () => {
  const [keys, setKeys] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [newKey, setNewKey] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchKeys = async () => {
    try {
      setError("");

      const response = await api.get("/keys");
      setKeys(response.data.apiKeys || response.data.keys || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load API keys."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const createKey = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter a name for the API key.");
      return;
    }

    try {
      setError("");
      setCreating(true);

      const response = await api.post("/keys", {
        name: name.trim(),
      });

      setNewKey(response.data.apiKey || response.data.key);
      setName("");
      await fetchKeys();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create API key."
      );
    } finally {
      setCreating(false);
    }
  };

  const deleteKey = async (id) => {
    try {
      setError("");
      await api.delete(`/keys/${id}`);
      setKeys((currentKeys) =>
        currentKeys.filter((key) => key._id !== id)
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete API key."
      );
    }
  };

  const copyKey = async () => {
    await navigator.clipboard.writeText(newKey);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage API keys for accessing your monitoring system.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {newKey && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Check size={18} className="text-green-600" />
            <h2 className="font-semibold text-green-800">
              API key created successfully
            </h2>
          </div>

          <p className="mb-3 text-sm text-green-700">
            Copy this key now. For security, it will not be shown again.
          </p>

          <div className="flex gap-2">
            <input
              value={newKey}
              readOnly
              className="min-w-0 flex-1 rounded-lg border border-green-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none"
            />

            <button
              onClick={copyKey}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <button
            onClick={() => setNewKey("")}
            className="mt-3 text-sm font-medium text-green-700 hover:underline"
          >
            Hide key
          </button>
        </div>
      )}

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 font-semibold text-gray-900">
          Create API Key
        </h2>
        <p className="mb-5 text-sm text-gray-500">
          Generate a key for programmatic access to your account.
        </p>

        <form onSubmit={createKey} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production API"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={creating}
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus size={17} />
            {creating ? "Creating..." : "Create Key"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="font-semibold text-gray-900">Your API Keys</h2>
          <p className="mt-1 text-sm text-gray-500">
            {keys.length} key{keys.length !== 1 ? "s" : ""} created
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading API keys...
          </div>
        ) : keys.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <KeyRound size={28} className="text-gray-500" />
            </div>

            <h3 className="font-semibold text-gray-900">
              No API keys yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Create an API key above to enable programmatic access.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {keys.map((key) => (
              <div
                key={key._id}
                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2.5">
                    <KeyRound size={18} className="text-blue-600" />
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      {key.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Created{" "}
                      {key.createdAt
                        ? new Date(key.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteKey(key._id)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeys;
