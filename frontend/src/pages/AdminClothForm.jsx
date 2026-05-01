import React, { useState } from "react";
import { createCloth } from "../api/clothApi.js";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  images: "",
  imageFiles: [],
  tags: "",
  fabrics: "",
  colors: "",
  designs: "",
  rating: "",
  reviewsCount: "",
  isFeatured: false,
  inStock: true,
};

export default function AdminClothForm() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const fabrics = form.fabrics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const colors = form.colors
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const designs = form.designs
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("price", String(Number(form.price)));
      formData.append("category", form.category.trim());
      formData.append("tags", JSON.stringify(tags));
      formData.append("fabrics", JSON.stringify(fabrics));
      formData.append("colors", JSON.stringify(colors));
      formData.append("designs", JSON.stringify(designs));
      if (form.rating) formData.append("rating", String(Number(form.rating)));
      if (form.reviewsCount) formData.append("reviewsCount", String(Number(form.reviewsCount)));
      formData.append("isFeatured", String(Boolean(form.isFeatured)));
      formData.append("inStock", String(Boolean(form.inStock)));

      if (form.imageFiles?.length) {
        form.imageFiles.forEach((file) => formData.append("images", file));
      } else if (form.images.trim()) {
        formData.append("images", form.images.trim());
      }

      if (!form.title.trim() || !form.price || !form.category.trim()) {
        setError("Title, price, and category are required.");
        setSubmitting(false);
        return;
      }

      const res = await createCloth(formData, token);
      if (res?.success) {
        setSuccess("Cloth created successfully.");
        setForm(emptyForm);
      } else {
        setError(res?.message || "Failed to create cloth.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create cloth.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-rose-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add New Cloth</h1>
            <p className="text-sm text-slate-600">Admin-only: requires valid token for the admin user.</p>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
            Admin Panel
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-100 border border-rose-200 text-rose-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm">
            {success}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Silk Designer Saree"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Traditional"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (INR) *</label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="2499"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={(e) => handleChange("rating", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="4.8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reviews Count</label>
                <input
                  type="number"
                  min="0"
                  value={form.reviewsCount}
                  onChange={(e) => handleChange("reviewsCount", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="120"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows="4"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="Elegant hand-embroidered saree with premium silk fabric."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleChange("imageFiles", Array.from(e.target.files || []))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <p className="text-xs text-slate-500 mt-2">Select one or more images to upload.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="New, Premium, Festive"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fabrics (comma separated)</label>
              <input
                type="text"
                value={form.fabrics}
                onChange={(e) => handleChange("fabrics", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Silk, Cotton, Linen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Colors (comma separated)</label>
              <input
                type="text"
                value={form.colors}
                onChange={(e) => handleChange("colors", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Red, Navy, Ivory"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Designs (comma separated)</label>
              <input
                type="text"
                value={form.designs}
                onChange={(e) => handleChange("designs", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="A-Line, Embroidered, Pleated"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => handleChange("isFeatured", e.target.checked)}
                className="h-4 w-4 text-rose-600"
              />
              Mark as Featured
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={form.inStock}
                onChange={(e) => handleChange("inStock", e.target.checked)}
                className="h-4 w-4 text-rose-600"
              />
              In Stock
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
              disabled={submitting}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-rose-600 text-white font-semibold shadow hover:bg-rose-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Create Cloth"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
