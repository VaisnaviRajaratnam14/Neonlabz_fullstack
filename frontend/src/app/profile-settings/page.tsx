"use client";

import Link from "next/link";
import { useState } from "react";

type ProfileSettings = {
  fullName: string;
  email: string;
  phone: string;
};

const defaultProfile: ProfileSettings = {
  fullName: "",
  email: "",
  phone: "",
};

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<ProfileSettings>(() => {
    if (typeof window === "undefined") {
      return defaultProfile;
    }

    const raw = localStorage.getItem("neonlabz_profile");
    if (!raw) {
      return defaultProfile;
    }

    try {
      return JSON.parse(raw) as ProfileSettings;
    } catch {
      localStorage.removeItem("neonlabz_profile");
      return defaultProfile;
    }
  });
  const [saved, setSaved] = useState(false);

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("neonlabz_profile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-4 inline-block rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-100"
      >
        Back
      </Link>

      <header className="mb-8 rounded-2xl border border-zinc-300/50 bg-surface/90 p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.22em] text-muted">Account</p>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      </header>

      {saved && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Profile settings saved.
        </p>
      )}

      <section className="rounded-2xl border border-zinc-300/50 bg-surface/90 p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Full Name</span>
            <input
              value={profile.fullName}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, fullName: event.target.value }))
              }
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              value={profile.email}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="Enter your email"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Phone</span>
            <input
              value={profile.phone}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, phone: event.target.value }))
              }
              placeholder="Enter your phone"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-accent px-6 py-2 font-semibold text-white hover:opacity-90"
          >
            Save Settings
          </button>
        </form>
      </section>
    </main>
  );
}
