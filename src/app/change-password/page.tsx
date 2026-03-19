"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AccountDetails = {
  name?: string;
  email?: string;
  password?: string;
  profileImage?: string;
};

export default function ChangePasswordPage() {
  const [storedPassword, setStoredPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const raw = localStorage.getItem("neonlabz_account");
      if (!raw) {
        setStoredPassword("");
        return;
      }

      try {
        const account = JSON.parse(raw) as AccountDetails;
        setStoredPassword(account.password ?? "");
      } catch {
        setStoredPassword("");
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!storedPassword) {
      setError("No existing password found. Please register or login first.");
      return;
    }

    if (currentPassword !== storedPassword) {
      setError("Current password is incorrect.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and re-entered password do not match.");
      return;
    }

    try {
      const raw = localStorage.getItem("neonlabz_account");
      const account = raw ? (JSON.parse(raw) as AccountDetails) : {};
      localStorage.setItem(
        "neonlabz_account",
        JSON.stringify({
          ...account,
          password: newPassword,
        }),
      );

      setStoredPassword(newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password changed successfully.");
    } catch {
      setError("Unable to change password. Please try again.");
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/profile"
        className="mb-4 inline-block rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-100"
      >
        Back to Profile
      </Link>

      <header className="mb-8 rounded-2xl border border-zinc-300/50 bg-surface/90 p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.22em] text-muted">Security</p>
        <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
      </header>

      {success && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-zinc-300/50 bg-surface/90 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Current Password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">New Password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={6}
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Re-enter New Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-accent px-6 py-2 font-semibold text-white hover:opacity-90"
          >
            Update Password
          </button>
        </form>
      </section>
    </main>
  );
}
