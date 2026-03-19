"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";

type AuthResponse = {
  accessToken: string;
  user: {
    id: number;
    email: string;
    createdAt: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const result = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(result.accessToken);
      localStorage.setItem(
        "neonlabz_account",
        JSON.stringify({
          name,
          email,
          password,
        }),
      );
      router.replace("/login");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[url('/backgroundg.webp')] bg-cover bg-center p-4 sm:p-8">
      <section className="mx-auto grid min-h-[560px] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_rgba(8,15,52,0.28)] md:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 p-10 text-white md:order-2 md:block">
          <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-10 -right-16 h-64 w-64 rounded-full bg-fuchsia-300/30 blur-2xl" />
          <div className="absolute left-14 top-24 h-20 w-20 rounded-full border border-white/45 bg-white/20" />
          <div className="absolute right-20 bottom-28 h-12 w-12 rounded-full border border-white/45 bg-white/20" />
          <div className="relative mt-36">
            <p className="text-xs uppercase tracking-[0.4em] text-white/80">Create</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight">Your Account</h1>
            <p className="mt-6 max-w-xs text-base text-white/85">Join NeonLabz and manage products with your own personalized workspace.</p>
          </div>
        </aside>

        <div className="flex flex-col justify-center p-8 sm:p-12 md:order-1">
          <p className="text-sm text-zinc-500">Welcome !</p>
          <h2 className="mt-1 text-xl font-semibold text-violet-600">Let&apos;s Start</h2>
          <p className="mt-5 text-lg font-semibold text-zinc-800">Create Your Account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400">Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-2 w-full border-0 border-b-2 border-zinc-300 bg-transparent px-0 py-2 text-zinc-900 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full border-0 border-b-2 border-zinc-300 bg-transparent px-0 py-2 text-zinc-900 outline-none focus:border-cyan-500"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
                className="mt-2 w-full border-0 border-b-2 border-zinc-300 bg-transparent px-0 py-2 text-zinc-900 outline-none focus:border-cyan-500"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Submit"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
