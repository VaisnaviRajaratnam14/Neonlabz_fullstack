"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type AccountDetails = {
  name: string;
  email: string;
  password: string;
  profileImage: string;
};

const emptyAccount: AccountDetails = {
  name: "",
  email: "",
  password: "",
  profileImage: "",
};

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [account, setAccount] = useState<AccountDetails>(emptyAccount);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const maskedPassword = account.password
    ? "*".repeat(Math.max(account.password.length, 8))
    : "";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAccount(loadStoredAccount());
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      localStorage.setItem("neonlabz_account", JSON.stringify(account));
      setSaveError("");
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch {
      setSaveError("Unable to save profile. Please try a smaller image and save again.");
    }
  }

  function handleProfileImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setAccount((prev) => ({ ...prev, profileImage: result }));
      }
    };
    reader.readAsDataURL(file);
  }

  function handleCancel() {
    setAccount(loadStoredAccount());
    setSaveError("");
    setSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </header>

      {saved && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Profile details updated.
        </p>
      )}

      {saveError && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {saveError}
        </p>
      )}

      <section className="rounded-2xl border border-zinc-300/50 bg-surface/90 p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-5">
          {!account.name && !account.email && !account.password && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              No saved account details found. Click Edit and save your profile details.
            </p>
          )}

          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-zinc-300 bg-zinc-100">
              {account.profileImage ? (
                <img
                  src={account.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-zinc-500">
                  {account.name ? account.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Profile Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
              <input
                type="button"
                value="Choose File"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="rounded-md border-0 bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              />
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">User Name</span>
            <input
              type="text"
              value={account.name}
              onChange={(event) => setAccount((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              value={account.email}
              onChange={(event) => setAccount((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Password</span>
            <input
              type="text"
              value={maskedPassword}
              readOnly
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
            <Link href="/change-password" className="mt-2 inline-block text-sm font-semibold text-accent">
              Change Password
            </Link>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded-lg bg-accent px-6 py-2 font-semibold text-white hover:opacity-90"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-zinc-300 px-6 py-2 font-semibold hover:bg-zinc-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function loadStoredAccount(): AccountDetails {
  if (typeof window === "undefined") {
    return emptyAccount;
  }

  let storedAccount: Partial<AccountDetails> = {};
  const raw = localStorage.getItem("neonlabz_account");
  if (raw) {
    try {
      storedAccount = JSON.parse(raw) as Partial<AccountDetails>;
    } catch {
      storedAccount = {};
    }
  }

  let legacyProfile: { fullName?: string; email?: string } = {};
  const legacyRaw = localStorage.getItem("neonlabz_profile");
  if (legacyRaw) {
    try {
      legacyProfile = JSON.parse(legacyRaw) as { fullName?: string; email?: string };
    } catch {
      legacyProfile = {};
    }
  }

  const tokenPayload = getTokenPayload();

  return {
    name: storedAccount.name ?? legacyProfile.fullName ?? "",
    email: storedAccount.email ?? legacyProfile.email ?? tokenPayload?.email ?? "",
    password: storedAccount.password ?? "",
    profileImage: storedAccount.profileImage ?? "",
  };
}

function getTokenPayload(): { email?: string } | null {
  const token = localStorage.getItem("neonlabz_token");
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    return JSON.parse(json) as { email?: string };
  } catch {
    return null;
  }
}
