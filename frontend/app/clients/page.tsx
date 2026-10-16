"use client";

import { useEffect, useState } from "react";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/clients")
      .then((response) => response.json())
      .then((data) => {
        setClients(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        company,
      }),
    });

    const data = await response.json();

    console.log(data);

    setClients((currentClients) => [...currentClients, data]);
    setShowForm(false);
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
  };

  const handleEdit = async () => {
    if (!editingClient) return;

    const response = await fetch(
      `http://127.0.0.1:8000/api/clients/${editingClient.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingClient.name,
          email: editingClient.email,
          phone: editingClient.phone,
          company: editingClient.company,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === data.id ? data : client
      )
    );

    setEditingClient(null);
  };

  const handleDelete = async (id: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this client?"
  );

  if (!confirmed) return;

  const response = await fetch(
    `http://127.0.0.1:8000/api/clients/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  console.log(data);

  setClients((currentClients) =>
    currentClients.filter((client) => client.id !== id)
  );
  };
  
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Clients
            </h1>

            <p className="mt-1 text-slate-500">
              Manage your clients and their information.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Add Client
          </button>
        </div>

        {showForm && (
          <div className="mb-8 mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Add New Client
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your client information below.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  placeholder="e.g. Sarah Tan"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  placeholder="e.g. sarah@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Phone
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={15}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  placeholder="e.g. 0123456789"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Company
                </label>

                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  placeholder="e.g. Sarah Events"
                />
              </div>

              <div className="mt-2 flex gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedClient && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {selectedClient.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Client Details
                </p>
              </div>

              <button
                onClick={() => setSelectedClient(null)}
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Email</p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedClient.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Phone</p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedClient.phone || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Company</p>

                <p className="mt-1 font-medium text-slate-900">
                  {selectedClient.company || "-"}
                </p>
              </div>
            </div>
          </div>
        )}

        {editingClient && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Edit Client
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your client information below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingClient(null)}
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  type="text"
                  value={editingClient.name}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      name: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={editingClient.email}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      email: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Phone
                </label>

                <input
                  type="tel"
                  value={editingClient.phone || ""}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  maxLength={15}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Company
                </label>

                <input
                  type="text"
                  value={editingClient.company || ""}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      company: e.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Client
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Company
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-slate-900">
                          {client.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {client.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {client.company || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {client.phone || "-"}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                          View
                        </button>

                        <button
                          onClick={() => setEditingClient(client)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
