
"use client";

import { useEffect, useState } from "react";

type Project = {
  id: number;
  name: string;
};

type Invoice = {
  id: number;
  project_id: number;
  invoice_number: string;
  amount: string | number;
  status: string;
  issue_date: string;
  due_date: string | null;
};

const API_URL = "http://127.0.0.1:8000/api";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("unpaid");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const loadInvoices = async () => {
    const response = await fetch(`${API_URL}/invoices`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to load invoices.");
    }

    const data = await response.json();

    setInvoices(Array.isArray(data) ? data : data.data ?? []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [invoiceResponse, projectResponse] = await Promise.all([
          fetch(`${API_URL}/invoices`, {
            headers: { Accept: "application/json" },
          }),
          fetch(`${API_URL}/projects`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!invoiceResponse.ok || !projectResponse.ok) {
          throw new Error("Failed to load data.");
        }

        const invoiceData = await invoiceResponse.json();
        const projectData = await projectResponse.json();

        setInvoices(
          Array.isArray(invoiceData)
            ? invoiceData
            : invoiceData.data ?? []
        );

        setProjects(
          Array.isArray(projectData)
            ? projectData
            : projectData.data ?? []
        );
      } catch {
        alert("Unable to load invoices or projects. Please check your server.");
      }
    };

    loadData();
  }, []);

  const resetForm = () => {
    setInvoiceNumber("");
    setProjectId("");
    setAmount("");
    setStatus("unpaid");
    setIssueDate("");
    setDueDate("");
    setEditingInvoiceId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!invoiceNumber.trim()) {
      alert("Please enter an invoice number.");
      return;
    }

    if (!projectId) {
      alert("Please select a project.");
      return;
    }

    if (amount.trim() === "" || !Number.isFinite(Number(amount)) || Number(amount) < 0) {
      alert("Amount must be a valid number and cannot be negative.");
      return;
    }

    if (!issueDate) {
      alert("Please select an Issue Date.");
      return;
    }

    if (dueDate && dueDate < issueDate) {
      alert("Due Date cannot be earlier than Issue Date.");
      return;
    }

    setSaving(true);

    try {
      const url = editingInvoiceId
        ? `${API_URL}/invoices/${editingInvoiceId}`
        : `${API_URL}/invoices`;

      const response = await fetch(url, {
        method: editingInvoiceId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          project_id: Number(projectId),
          invoice_number: invoiceNumber.trim(),
          amount: Number(amount),
          status,
          issue_date: issueDate,
          due_date: dueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data.errors && typeof data.errors === "object"
            ? Object.values(data.errors).flat().join("\n")
            : data.message || "Failed to save invoice.";

        alert(message);
        return;
      }

      await loadInvoices();
      resetForm();

      alert(
        editingInvoiceId
          ? "Invoice updated successfully."
          : "Invoice saved successfully."
      );
    } catch {
      alert("Unable to save or reload invoice. Please check your server.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoiceId(invoice.id);
    setInvoiceNumber(invoice.invoice_number);
    setProjectId(String(invoice.project_id));
    setAmount(String(invoice.amount));
    setStatus(invoice.status);
    setIssueDate(invoice.issue_date?.slice(0, 10) || "");
    setDueDate(invoice.due_date?.slice(0, 10) || "");
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/invoices/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to delete invoice.");
        return;
      }

      setInvoices((currentInvoices) =>
        currentInvoices.filter((invoice) => invoice.id !== id)
      );
    } catch {
      alert("Unable to delete invoice. Please check your server.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Invoices
            </h1>
            <p className="mt-1 text-slate-500">
              Create and manage invoices for your projects.
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
            + Add Invoice
          </button>
        </div>

        {showForm && (
          <div className="mb-8 mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingInvoiceId ? "Edit Invoice" : "Add New Invoice"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your invoice information below.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Invoice Number
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  placeholder="e.g. INV-001"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Project
                </label>
                <select
                  required
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

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Amount (RM)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  placeholder="e.g. 1500.00"
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
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Issue Date
                </label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Due Date
                </label>
                <input
                  type="date"
                  min={issueDate || undefined}
                  value={dueDate}
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
                  className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingInvoiceId
                      ? "Update Invoice"
                      : "Save Invoice"}
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
                    Invoice
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Project
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Amount
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
                {invoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-sm text-slate-500"
                    >
                      No invoices found.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-900">
                          {invoice.invoice_number || "-"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Issued: {invoice.issue_date?.slice(0, 10) || "-"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {projects.find(
                          (project) => project.id === invoice.project_id
                        )?.name || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        RM {Number(invoice.amount).toFixed(2)}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {invoice.status}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {invoice.due_date?.slice(0, 10) || "-"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(invoice)}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(invoice.id)}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
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
