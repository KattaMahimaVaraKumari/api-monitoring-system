import { Activity, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";

const Dashboard = () => {
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Total APIs",
            value: "0",
            icon: Activity,
          },
          {
            title: "Uptime",
            value: "0%",
            icon: CheckCircle2,
          },
          {
            title: "Avg. Latency",
            value: "0 ms",
            icon: Clock3,
          },
          {
            title: "Failed Checks",
            value: "0",
            icon: AlertTriangle,
          },
        ].map((stat) => {
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
          Your API monitoring dashboard is ready to be connected
          to the backend. Soon, you will see live API health,
          response times, analytics, and incidents here.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;