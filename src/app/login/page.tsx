"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getToken, setToken } from "@/lib/auth";

type AuthResponse = {
  accessToken: string;
  user: {
    id: number;
    email: string;
    createdAt: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace("/");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const result = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(result.accessToken);
      const existingAccountRaw = localStorage.getItem("neonlabz_account");
      const existingAccount = existingAccountRaw
        ? (JSON.parse(existingAccountRaw) as { name?: string; email?: string; password?: string })
        : {};
      localStorage.setItem(
        "neonlabz_account",
        JSON.stringify({
          name: existingAccount.name ?? "",
          email,
          password,
        }),
      );
      router.replace("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return null;
  }

  return (
    <main className="min-h-screen w-full bg-[url('/backgroundg.webp')] bg-cover bg-center p-4 sm:p-8">
      <section className="mx-auto grid min-h-[560px] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_rgba(8,15,52,0.28)] md:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-violet-600 p-10 text-white md:block">
          <div className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-10 -right-16 h-64 w-64 rounded-full bg-fuchsia-300/30 blur-2xl" />
          <div className="absolute left-12 top-28 h-16 w-16 rounded-full border border-white/40 bg-white/20" />
          <div className="absolute right-16 bottom-28 h-10 w-10 rounded-full border border-white/40 bg-white/20" />
          <div className="relative mt-36">
            <p className="text-xs uppercase tracking-[0.4em] text-white/80">Welcome</p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight">NeonLabz</h1>
            <p className="mt-6 max-w-xs text-base text-white/85">Sign in to your account and continue managing products securely.</p>
          </div>
        </aside>

        <div className="flex flex-col justify-center p-8 sm:p-12">
          <p className="text-sm text-zinc-500">Hello !</p>
          <h2 className="mt-1 text-xl font-semibold text-violet-600">Good Morning</h2>
          <p className="mt-5 text-lg font-semibold text-zinc-800">Login Your Account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full border-0 border-b-2 border-zinc-300 bg-transparent px-0 py-2 text-zinc-900 outline-none focus:border-sky-500"
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
                className="mt-2 w-full border-0 border-b-2 border-zinc-300 bg-transparent px-0 py-2 text-zinc-900 outline-none focus:border-sky-500"
              />
            </label>

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-zinc-300" />
                Remember
              </label>
              <span>Forgot Password?</span>
            </div>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-gradient-to-r from-sky-500 to-violet-500 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:opacity-90 disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Submit"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            No account yet?{" "}
            <Link href="/register" className="font-semibold text-violet-600 hover:text-violet-700">
              Create Account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
