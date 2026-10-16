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
  amount: string;
  status: string;
  issue_date: string;
  due_date: string | null;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("unpaid");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingInvoiceId
      ? `http://127.0.0.1:8000/api/invoices/${editingInvoiceId}`
      : "http://127.0.0.1:8000/api/invoices";

    const response = await fetch(url, {
      method: editingInvoiceId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: Number(projectId),
        invoice_number: invoiceNumber,
        amount: Number(amount),
        status,
        issue_date: issueDate,
        due_date: dueDate || null,
      }),
    });

    const data = await response.json();

    if (editingInvoiceId) {
      setInvoices((currentInvoices) =>
        currentInvoices.map((invoice) =>
          invoice.id === editingInvoiceId ? data : invoice
        )
      );
    } else {
      setInvoices((currentInvoices) => [
        ...currentInvoices,
        data,
      ]);
    }

    setInvoiceNumber("");
    setProjectId("");
    setAmount("");
    setStatus("unpaid");
    setIssueDate("");
    setDueDate("");
    setEditingInvoiceId(null);
    setShowForm(false);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoiceId(invoice.id);
    setInvoiceNumber(invoice.invoice_number);
    setProjectId(String(invoice.project_id));
    setAmount(invoice.amount);
    setStatus(invoice.status);
    setIssueDate(invoice.issue_date || "");
    setDueDate(invoice.due_date || "");
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) return;

    const response = await fetch(
      `http://127.0.0.1:8000/api/invoices/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    console.log(data);

    setInvoices((currentInvoices) =>
      currentInvoices.filter((invoice) => invoice.id !== id)
    );
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/invoices")
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data);
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
              Invoices
            </h1>

            <p className="mt-1 text-slate-500">
              Create and manage invoices for your projects.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Add Invoice
          </button>
        </div>

        {showForm && (
          <div className="mb-8 mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Add New Invoice
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
                  Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
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
                  Save Invoice
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
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-6 py-5">
                      <p className="font-medium text-slate-900">
                        {invoice.invoice_number}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Issued: {invoice.issue_date}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {invoice.project_id}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      RM {invoice.amount}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {invoice.status}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {invoice.due_date || "-"}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}