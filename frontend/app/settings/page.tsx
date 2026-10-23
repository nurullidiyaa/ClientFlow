"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("MYR");
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-900";

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-950">
        Settings
      </h1>

      <p className="mt-2 text-slate-700">
        Manage your profile and business preferences.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Freelancer Profile
          </h2>

          <p className="mt-1 text-sm text-slate-700">
            Your personal information.
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setSaved(false);
                }}
                placeholder="Enter your full name"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSaved(false);
                }}
                placeholder="you@example.com"
                className={inputClass}
                required
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Business Preferences
          </h2>

          <p className="mt-1 text-sm text-slate-700">
            Set up your business details and currency.
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <label htmlFor="businessName" className={labelClass}>
                Business Name
              </label>

              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(event) => {
                  setBusinessName(event.target.value);
                  setSaved(false);
                }}
                placeholder="Enter your business name"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="currency" className={labelClass}>
                Default Currency
              </label>

              <select
                id="currency"
                value={currency}
                onChange={(event) => {
                  setCurrency(event.target.value);
                  setSaved(false);
                }}
                className={inputClass}
              >
                <option value="MYR">MYR — Malaysian Ringgit (RM)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="SGD">SGD — Singapore Dollar (S$)</option>
                <option value="GBP">GBP — British Pound (£)</option>
                <option value="EUR">EUR — Euro (€)</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Save Settings
          </button>

          {saved && (
            <p
              role="status"
              className="text-sm font-semibold text-emerald-700"
            >
              Settings submitted successfully!
            </p>
          )}
        </div>

        <p className="text-sm leading-6 text-slate-700">
          Note: Settings are currently stored only in this page&apos;s
          temporary state. Permanent saving will be added when backend
          integration is implemented.
        </p>
      </form>
    </div>
  );
}