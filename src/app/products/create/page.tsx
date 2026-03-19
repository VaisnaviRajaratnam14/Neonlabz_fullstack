"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Product, ProductInput } from "@/types/product";

const defaultForm: ProductInput = {
  title: "",
  description: "",
  stockNo: 0,
  price: 0,
  discountPrice: 0,
};

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>(defaultForm);
  const [productId, setProductId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      const numericId = Number(productId);
      if (!Number.isInteger(numericId) || numericId < 1) {
        throw new Error("ID must be a positive whole number.");
      }

      await apiFetch<Product>("/products", {
        method: "POST",
        body: JSON.stringify({ ...form, id: numericId }),
      });
      router.push("/?created=1");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
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
        <p className="text-sm uppercase tracking-[0.22em] text-muted">Product Management</p>
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
      </header>

      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-zinc-300/50 bg-surface/90 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">ID</span>
            <input
              type="number"
              min={1}
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              placeholder="Enter product ID"
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Name</span>
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Enter product name"
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-foreground">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Enter product description"
              required
              rows={4}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Stock No</span>
              <input
                type="number"
                min={0}
                value={form.stockNo === 0 ? "" : form.stockNo}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    stockNo: event.target.value === "" ? 0 : Number(event.target.value),
                  }))
                }
                placeholder="0"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Price (LKR)</span>
              <input
                type="text"
                inputMode="decimal"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
                placeholder="LKR 0.00"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-foreground">Discount Price (LKR)</span>
              <input
                type="text"
                inputMode="decimal"
                value={form.discountPrice}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, discountPrice: Number(event.target.value) }))
                }
                placeholder="LKR 0.00"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 outline-none focus:border-accent"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-accent px-6 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-70"
            >
              {submitting ? "Saving..." : "Create Product"}
            </button>
            <Link
              href="/"
              className="rounded-lg border border-zinc-300 px-6 py-2 font-semibold hover:bg-zinc-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
