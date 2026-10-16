export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-900 p-6 text-white">
      <div>
        <h1 className="text-2xl font-bold">ClientFlow</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your business
        </p>
      </div>

      <nav className="mt-10 flex flex-col gap-2">
        <a
          href="#"
          className="rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium"
        >
          Dashboard
        </a>

        <a
          href="/clients"
          className="rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
        >
          Clients
        </a>

        <a
          href="#"
          className="rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
        >
          Projects
        </a>

        <a
          href="#"
          className="rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
        >
          Tasks
        </a>

        <a
          href="#"
          className="rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
        >
          Invoices
        </a>

        <a
          href="#"
          className="rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
        >
          Payments
        </a>
      </nav>

      <div className="mt-auto">
        <a
          href="#"
          className="block rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-800"
        >
          Settings
        </a>
      </div>
    </aside>
  );
}