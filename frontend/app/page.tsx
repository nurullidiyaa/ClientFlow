import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-slate-500">
            Welcome back to ClientFlow.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Total Clients</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">1</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Projects</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">1</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Invoices</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">3</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Revenue</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                RM 3,500
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}