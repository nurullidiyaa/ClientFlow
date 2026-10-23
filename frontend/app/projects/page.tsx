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

const API_URL = "http://127.0.0.1:8000/api";

function getList<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray(data.data)
  ) {
    return data.data as T[];
  }

  return [];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const loadProjects = async () => {
    const response = await fetch(`${API_URL}/projects`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to load projects.");
    }

    const data: unknown = await response.json();
    setProjects(getList<Project>(data));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsResponse, clientsResponse] = await Promise.all([
          fetch(`${API_URL}/projects`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`${API_URL}/clients`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!projectsResponse.ok || !clientsResponse.ok) {
          throw new Error("Failed to load data.");
        }

        const projectsData: unknown = await projectsResponse.json();
        const clientsData: unknown = await clientsResponse.json();

        setProjects(getList<Project>(projectsData));
        setClients(getList<Client>(clientsData));
      } catch {
        alert("Unable to load projects or clients. Please check your server.");
      }
    };

    loadData();
  }, []);

  const resetForm = () => {
    setName("");
    setClientId("");
    setDescription("");
    setStatus("pending");
    setStartDate("");
    setDueDate("");
    setEditingProjectId(null);
    setShowForm(false);
  };

  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);

    // Clear Due Date if it is now earlier than Start Date.
    if (newStartDate && dueDate && dueDate < newStartDate) {
      setDueDate("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a project name.");
      return;
    }

    if (!clientId) {
      alert("Please select a client.");
      return;
    }

    if (startDate && dueDate && dueDate < startDate) {
      alert("Due Date cannot be earlier than Start Date. Please choose another date.");
      return;
    }

    setSaving(true);

    try {
      const url = editingProjectId
        ? `${API_URL}/projects/${editingProjectId}`
        : `${API_URL}/projects`;

      const response = await fetch(url, {
        method: editingProjectId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: Number(clientId),
          name: name.trim(),
          description: description.trim() || null,
          status,
          start_date: startDate || null,
          due_date: dueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.errors && typeof data.errors === "object"
            ? Object.values(data.errors).flat().join("\n")
            : data.message || "Failed to save project.";

        alert(message);
        return;
      }

      await loadProjects();
      resetForm();

      alert(
        editingProjectId
          ? "Project updated successfully."
          : "Project saved successfully."
      );
    } catch {
      alert(
        "Unable to save or reload the project. Please check your Laravel server."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setName(project.name || "");
    setClientId(String(project.client_id ?? ""));
    setDescription(project.description || "");
    setStatus(project.status || "pending");
    setStartDate(project.start_date?.slice(0, 10) || "");
    setDueDate(project.due_date?.slice(0, 10) || "");
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to delete project.");
        return;
      }

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== id)
      );
    } catch {
      alert("Unable to delete project. Please check your server.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Projects
            </h1>
            <p className="mt-1 text-slate-500">
              Manage your projects and track their progress.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Add Project
          </button>
        </div>

        {showForm && (
          <div className="mb-8 mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingProjectId ? "Edit Project" : "Add New Project"}
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
                  required
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
                  required
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
                  <option value="on_hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  max={dueDate || undefined}
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
                  min={startDate || undefined}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>

              <div className="mt-2 flex gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingProjectId
                      ? "Update Project"
                      : "Save Project"}
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
                    Client
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
                {projects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-sm text-slate-500"
                    >
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  projects.map((project, index) => (
                    <tr
                      key={
                        project.id != null
                          ? project.id
                          : `project-${index}`
                      }
                      className="border-b border-slate-100"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-900">
                          {project.name || "-"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {project.description || "-"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {clients.find(
                          (client) => client.id === Number(project.client_id)
                        )?.name || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {project.status || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {project.start_date?.slice(0, 10) || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {project.due_date?.slice(0, 10) || "-"}
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
                            disabled={project.id == null}
                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}