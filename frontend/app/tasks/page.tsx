"use client";

import { useEffect, useState } from "react";

type Project = {
  id: number;
  name: string;
};

type Task = {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

const url = editingTaskId
  ? `http://127.0.0.1:8000/api/tasks/${editingTaskId}`
  : "http://127.0.0.1:8000/api/tasks";

const response = await fetch(url, {
  method: editingTaskId ? "PUT" : "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    project_id: Number(projectId),
    title,
    description,
    status,
    due_date: dueDate || null,
  }),
});

  const data = await response.json();

  if (editingTaskId) {
    setTasks((currentTasks) =>
        currentTasks.map((task) =>
        task.id === editingTaskId ? data : task
        )
    );
    } else {
    setTasks((currentTasks) => [...currentTasks, data]);
    }

  setTitle("");
  setProjectId("");
  setDescription("");
  setStatus("pending");
  setDueDate("");
  setEditingTaskId(null);
  setShowForm(false);
};

    const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setProjectId(String(task.project_id));
    setDescription(task.description || "");
    setStatus(task.status);
    setDueDate(task.due_date || "");
    setShowForm(true);
    };

    const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/${id}`,
        {
        method: "DELETE",
        }
    );

    const data = await response.json();

    console.log(data);

    setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
    );
    };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      });

    fetch("http://127.0.0.1:8000/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Tasks
            </h1>

            <p className="mt-1 text-slate-500">
              Manage your tasks and track their progress.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Add Task
          </button>
        </div>

        {showForm && (
          <div className="mb-8 mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Add New Task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your task information below.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Task Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  placeholder="e.g. Prepare camera equipment"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Project
                </label>

                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                >
                  <option value="" disabled>
                    Select a project
                  </option>

                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
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
                  placeholder="Describe the task..."
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
                  Save Task
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
                    Task
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Project
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
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
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-900">
                        {task.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {task.description || "-"}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {task.project_id}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {task.status}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {task.due_date || "-"}
                    </td>

                    <td className="px-6 py-5">
                    <div className="flex gap-3">
                        <button
                        type="button"
                        onClick={() => handleEdit(task)}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                        Edit
                        </button>

                        <button
                        type="button"
                         onClick={() => handleDelete(task.id)}
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