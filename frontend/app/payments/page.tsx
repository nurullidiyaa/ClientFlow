"use client";

import { useEffect, useState } from "react";

type Invoice = {
  id: number;
  invoice_number: string;
  amount: string;
};

type Payment = {
  id: number;
  invoice_id: number;
  amount: string;
  payment_method: string | null;
  transaction_id: string | null;
  status: string;
  paid_at: string | null;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);

  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [status, setStatus] = useState("pending");
  const [paidAt, setPaidAt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingPaymentId
      ? `http://127.0.0.1:8000/api/payments/${editingPaymentId}`
      : "http://127.0.0.1:8000/api/payments";

    const response = await fetch(url, {
      method: editingPaymentId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoice_id: Number(invoiceId),
        amount: Number(amount),
        payment_method: paymentMethod || null,
        transaction_id: transactionId || null,
        status,
        paid_at: paidAt || null,
      }),
    });

    const data = await response.json();

    if (editingPaymentId) {
      setPayments((currentPayments) =>
        currentPayments.map((payment) =>
          payment.id === editingPaymentId ? data : payment
        )
      );
    } else {
      setPayments((currentPayments) => [...currentPayments, data]);
    }

    setInvoiceId("");
    setAmount("");
    setPaymentMethod("");
    setTransactionId("");
    setStatus("pending");
    setPaidAt("");
    setEditingPaymentId(null);
    setShowForm(false);
  };

  const handleEdit = (payment: Payment) => {
    setEditingPaymentId(payment.id);
    setInvoiceId(String(payment.invoice_id));
    setAmount(payment.amount);
    setPaymentMethod(payment.payment_method || "");
    setTransactionId(payment.transaction_id || "");
    setStatus(payment.status);
    setPaidAt(payment.paid_at || "");
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) return;

    const response = await fetch(
      `http://127.0.0.1:8000/api/payments/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    console.log(data);

    setPayments((currentPayments) =>
      currentPayments.filter((payment) => payment.id !== id)
    );
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/payments")
      .then((response) => response.json())
      .then((data) => {
        setPayments(data);
      });

    fetch("http://127.0.0.1:8000/api/invoices")
      .then((response) => response.json())
      .then((data) => {
        setInvoices(data);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Payments
            </h1>

            <p className="mt-1 text-slate-500">
              Track payments received from your invoices.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            + Add Payment
          </button>
        </div>

        {showForm && (
          <div className="mb-8 mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingPaymentId ? "Edit Payment" : "Add New Payment"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your payment information below.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Invoice
                </label>

                <select
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                >
                  <option value="" disabled>
                    Select an invoice
                  </option>

                  {invoices.map((invoice) => (
                    <option key={invoice.id} value={invoice.id}>
                      {invoice.invoice_number} - RM {invoice.amount}
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
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                >
                  <option value="">Select payment method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="online_payment">Online Payment</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Transaction ID
                </label>

                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                  placeholder="e.g. TXN-001"
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
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Paid Date
                </label>

                <input
                  type="date"
                  value={paidAt}
                  onChange={(e) => setPaidAt(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
                />
              </div>

              <div className="mt-2 flex gap-3 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPaymentId(null);
                  }}
                  className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Save Payment
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
                    Amount
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Payment Method
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Transaction ID
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Paid Date
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => {
                  const invoice = invoices.find(
                    (invoice) => invoice.id === payment.invoice_id
                  );

                  return (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-6 py-5">
                        <p className="font-medium text-slate-900">
                          {invoice?.invoice_number ||
                            `Invoice #${payment.invoice_id}`}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        RM {payment.amount}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {payment.payment_method || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {payment.transaction_id || "-"}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {payment.status}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {payment.paid_at || "-"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(payment)}
                            className="text-sm font-medium text-slate-600 hover:text-slate-900"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(payment.id)}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}