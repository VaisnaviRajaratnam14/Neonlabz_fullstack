"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import { Product } from "@/types/product";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, item) => sum + item.stockNo, 0);
  const averagePrice =
    totalProducts > 0
      ? products.reduce((sum, item) => sum + Number(item.price), 0) / totalProducts
      : 0;
  const discountedProducts = products.filter(
    (item) => Number(item.discountPrice) < Number(item.price),
  ).length;
  const lkrFormatter = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch<Product[]>("/products");
      setProducts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    setIsAuthorized(true);
    void loadProducts();
  }, [loadProducts, router]);

  useEffect(() => {
    const loadProfileImage = () => {
      setProfileImage(getStoredProfileImage());
    };

    loadProfileImage();
    window.addEventListener("storage", loadProfileImage);
    return () => window.removeEventListener("storage", loadProfileImage);
  }, []);

  useEffect(() => {
    if (searchParams.get("created") !== "1") {
      return;
    }

    setSuccessMessage("Product successfully created.");
    router.replace("/");

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchParams, router]);

  if (!isAuthorized) {
    return null;
  }

  function openDeleteModal(id: number) {
    setDeleteTargetId(id);
  }

  function closeDeleteModal() {
    if (deleting) {
      return;
    }
    setDeleteTargetId(null);
  }

  async function confirmDelete() {
    if (deleteTargetId === null) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      await apiFetch(`/products/${deleteTargetId}`, {
        method: "DELETE",
      });
      setDeleteTargetId(null);
      await loadProducts();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <main className="min-h-screen w-full bg-[url('/backg.webp')] bg-cover bg-center bg-fixed">
      <div className="mx-auto w-full max-w-6xl bg-white/40 px-4 py-8 backdrop-blur-[1px] sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl border border-zinc-300/50 bg-surface/90 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/account"
                aria-label="Profile"
                title="Profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
              >
                {profileImage ? (
                  <span
                    className="h-full w-full rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${profileImage})` }}
                  />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
                    <path
                      d="M5 19c1.6-3 4.1-4.5 7-4.5s5.4 1.5 7 4.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-300/50 bg-surface/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Total Products</p>
            <p className="mt-2 text-3xl font-bold">{totalProducts}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Total Stock</p>
            <p className="mt-2 text-3xl font-bold text-blue-800">{totalStock}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Avg Price</p>
            <p className="mt-2 text-3xl font-bold text-amber-800">{lkrFormatter.format(averagePrice)}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Discounted</p>
            <p className="mt-2 text-3xl font-bold text-emerald-800">{discountedProducts}</p>
          </div>
        </section>

        {successMessage && (
          <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <section className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">All Records</h2>
          <Link
            href="/products/create"
            className="rounded-lg bg-accent px-6 py-2 font-semibold text-white hover:opacity-90"
          >
            + Create Product
          </Link>
        </section>

        <section className="mb-12 rounded-2xl border border-zinc-300/50 bg-surface/90 p-6 shadow-sm">
          {loading ? (
            <p className="text-muted">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="py-8 text-center text-muted">No records yet. Create your first product to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-muted">
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Stock No</th>
                    <th className="px-4 py-3 font-medium">Price (LKR)</th>
                    <th className="px-4 py-3 font-medium">Discount Price (LKR)</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="align-top border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3 font-semibold">{product.id}</td>
                      <td className="px-4 py-3 font-semibold">{product.title}</td>
                      <td className="px-4 py-3 text-zinc-700">{product.description}</td>
                      <td className="px-4 py-3">{product.stockNo}</td>
                      <td className="px-4 py-3">{lkrFormatter.format(Number(product.price))}</td>
                      <td className="px-4 py-3">{lkrFormatter.format(Number(product.discountPrice))}</td>
                      <td className="px-4 py-3 text-xs">{new Date(product.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            href={`/products/edit/${product.id}`}
                            className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-semibold hover:bg-zinc-100"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => openDeleteModal(product.id)}
                            className="rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
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
          )}
        </section>

        {deleteTargetId !== null && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-24">
            <div className="w-full max-w-md rounded-md border border-zinc-300 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                <h3 className="text-3xl font-semibold text-zinc-800">Delete</h3>
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="text-2xl text-zinc-400 hover:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  x
                </button>
              </div>
              <div className="px-5 py-6 text-xl text-zinc-700">Are you sure you want to delete this item?</div>
              <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-4">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="rounded-md border border-zinc-300 bg-white px-5 py-2 text-xl font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void confirmDelete()}
                  disabled={deleting}
                  className="rounded-md bg-red-600 px-5 py-2 text-xl font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function getStoredProfileImage(): string {
  try {
    const raw = localStorage.getItem("neonlabz_account");
    if (!raw) {
      return "";
    }

    const parsed = JSON.parse(raw) as { profileImage?: string };
    return parsed.profileImage ?? "";
  } catch {
    return "";
  }
}
