
"use client";

import { useEffect, useState } from "react";

type DashboardData = {
  total_clients: number;
  total_projects: number;
  total_invoices: number;
  total_revenue: number;
  paid_invoices?: number;
  unpaid_invoices?: number;
  pending_payments?: number;
};

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/dashboard"
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load dashboard data. Please try again."
          );
        }

        const result: DashboardData = await response.json();
        setData(result);
      } catch {
        setError(
          "Could not connect to the server. Make sure Laravel is running."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 2,
    }).format(amount);

  const stats = [
    {
      title: "Total Clients",
      value: data?.total_clients ?? 0,
      color: "text-slate-900",
    },
    {
      title: "Projects",
      value: data?.total_projects ?? 0,
      color: "text-slate-900",
    },
    {
      title: "Invoices",
      value: data?.total_invoices ?? 0,
      color: "text-slate-900",
    },
    {
      title: "Revenue",
      value: formatCurrency(data?.total_revenue ?? 0),
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold text-slate-900">
        Dashboard
      </h1>

      <p className="mt-1 text-slate-500">
        Welcome back to ClientFlow.
      </p>

      {loading && (
        <p className="mt-8 text-slate-500">
          Loading dashboard data...
        </p>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>

                <p
                  className={`mt-2 text-3xl font-bold ${stat.color}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Paid Invoices
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {data.paid_invoices ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Unpaid Invoices
              </p>
              <p className="mt-2 text-2xl font-bold text-amber-600">
                {data.unpaid_invoices ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Pending Payments
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {data.pending_payments ?? 0}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
