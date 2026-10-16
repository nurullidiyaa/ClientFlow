"use client";

import { useEffect, useState } from "react";

type Project = {
  id: number;
  client_id: number;
  name: string;
  description: string | null;
  status: string;
  start_date: string | null;
  due_date: string | null;
};

type Client = {
  id: number;
  name: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      });

    fetch("http://127.0.0.1:8000/api/clients")
      .then((response) => response.json())
      .then((data) => {
        setClients(data);
      });
  }, []);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingProjectId
          ? `http://127.0.0.1:8000/api/projects/${editingProjectId}`
          : "http://127.0.0.1:8000/api/projects";

        const response = await fetch(url, {
          method: editingProjectId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: Number(clientId),
            name,
            description,
            status,
            start_date: startDate || null,
            due_date: dueDate || null,
          }),
        });

        const data = await response.json();

        if (editingProjectId) {
          setProjects((currentProjects) =>
            currentProjects.map((project) =>
              project.id === editingProjectId ? data : project
            )
          );
        } else {
          setProjects((currentProjects) => [...currentProjects, data]);
        }

        setEditingProjectId(null);
        setShowForm(false);
      };

  const handleDelete = async (id: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this project?"
  );

  if (!confirmed) return;

  const response = await fetch(
    `http://127.0.0.1:8000/api/projects/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  console.log(data);

  setProjects((currentProjects) =>
    currentProjects.filter((project) => project.id !== id)
  );
};

  const handleEdit = (project: Project) => {
  setEditingProjectId(project.id);
  setName(project.name);
  setClientId(String(project.client_id));
  setDescription(project.description || "");
  setStatus(project.status);
  setStartDate(project.start_date || "");
  setDueDate(project.due_date || "");
  setShowForm(true);
};

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Projects
            </h1>

            <p className="mt-1 text-slate-500">
              Manage your projects and track their progress.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Add Project
          </button>
        </div>

        {showForm && (
          <div className="mb-8 mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Add New Project
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your project information below.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Project Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  placeholder="e.g. Wedding Photography"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Client
                </label>

                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                >
                  <option value="" disabled>
                    Select a client
                  </option>

                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  placeholder="Describe the project..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Project
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Client ID
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Start Date
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Due Date
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-slate-900">
                          {project.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {project.description || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {project.client_id}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {project.status}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {project.start_date || "-"}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {project.due_date || "-"}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(project)}
                          className="text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(project.id)}
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