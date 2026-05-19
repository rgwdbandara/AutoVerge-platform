import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../lib/cloudinary";
import { useApi } from "../../lib/api";
import { useTranslation } from "react-i18next";

const CATEGORIES = [
  { value: "Car Reviews", label: "Car Reviews" },
  { value: "Buying Guide", label: "Buying Guide" },
  { value: "EV News", label: "EV News" },
  { value: "Vehicle Tips", label: "Vehicle Tips" },
];

function AdminAIArticles() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [articles, setArticles] = useState([]);
  const [editing, setEditing] = useState(null);
  const api = useApi();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError(t("adminArticles.enterTopic", { defaultValue: "Please enter an article topic." }));
      return;
    }

    setError("");
    setLoading(true);

    try {
      // If an image file is selected, upload to Cloudinary first
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const res = await axios.post("http://localhost:5003/api/articles/generate", {
        topic: topic.trim(),
        category,
        image: imageUrl,
      });

      if (res?.data?.success) {
        setCreated(res.data.article);
      } else {
        setError(res?.data?.message || t("adminArticles.generateFailed", { defaultValue: "Failed to generate article" }));
      }
    } catch (err) {
      console.error("Generate error:", err);
      setError(err?.response?.data?.message || err.message || t("adminArticles.generateFailed", { defaultValue: "Failed to generate article" }));
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/articles");
      setArticles(Array.isArray(res.data.articles) ? res.data.articles : []);
    } catch (err) {
      console.error("Failed to load articles", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this article permanently?")) return;
    try {
      await api(`/api/vehicles/admin/articles/${id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert(t("adminArticles.deleteFailed", { defaultValue: "Failed to delete article" }));
    }
  };

  const startEdit = (article) => {
    setEditing({ ...article });
    setImagePreview(article.image || "");
  };

  const cancelEdit = () => {
    setEditing(null);
    setImageFile(null);
    setImagePreview("");
  };

  const saveEdit = async () => {
    if (!editing) return;

    try {
      let imageUrl = editing.image || "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        title: editing.title,
        summary: editing.summary,
        content: editing.content,
        image: imageUrl,
        category: editing.category,
        tags: Array.isArray(editing.tags) ? editing.tags : editing.tags?.split?.(",") || [],
        featured: !!editing.featured,
      };

      const res = await api(`/api/vehicles/admin/articles/${editing._id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      // update local list
      setArticles((prev) => prev.map((a) => (a._id === res.article._id ? res.article : a)));
      setEditing(null);
      setImageFile(null);
      setImagePreview("");
    } catch (err) {
      console.error("Save failed", err);
      alert(t("adminArticles.saveFailed", { defaultValue: "Failed to save article" }));
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("adminArticles.title", { defaultValue: "AI Article Generator" })}</h1>
        <p className="text-sm text-slate-500">{t("adminArticles.subtitle", { defaultValue: "Generate and publish articles automatically" })}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow dark:border-white/10 dark:bg-slate-900">
        <label className="block text-sm font-medium">{t("adminArticles.topicLabel", { defaultValue: "Article Topic" })}</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t("adminArticles.topicPlaceholder", { defaultValue: "e.g. Best Hybrid Cars in Sri Lanka 2026" })}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-400 dark:border-white/10 dark:bg-slate-900 dark:text-white"
        />

        <label className="mt-4 block text-sm font-medium">{t("adminArticles.categoryLabel", { defaultValue: "Category" })}</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 w-56 rounded-lg border border-slate-200 px-3 py-2 text-slate-900 outline-none transition-colors duration-200 dark:border-white/10 dark:bg-slate-900 dark:text-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <label className="mt-4 block text-sm font-medium">{t("adminArticles.heroImageLabel", { defaultValue: "Optional Hero Image" })}</label>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setImageFile(f || null);
              setImagePreview(f ? URL.createObjectURL(f) : "");
            }}
            className="text-sm"
          />
          {imagePreview && (
            <img src={imagePreview} alt="preview" className="h-16 w-24 rounded object-cover border" />
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-400 disabled:opacity-70"
          >
            {loading ? t("adminArticles.generating", { defaultValue: "Generating..." }) : t("adminArticles.generate", { defaultValue: "Generate AI Article" })}
          </button>

          {created && (
            <button
              onClick={() => navigate(`/articles/${created.slug}`)}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-900 hover:bg-slate-100 dark:border-white/10 dark:text-white"
            >
              {t("adminArticles.viewCreated", { defaultValue: "View Created Article" })}
            </button>
          )}
        </div>

        {error && <div className="mt-4 text-sm text-red-500">{error}</div>}

        {created && (
          <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900">
            <h3 className="text-lg font-bold">{t("adminArticles.createdLabel", { defaultValue: "Created:" })} {created.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("adminArticles.slugLabel", { defaultValue: "Slug:" })} {created.slug}</p>
          </div>
        )}
      </div>

      {/* Existing articles list with edit/delete */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">{t("adminArticles.existingTitle", { defaultValue: "Existing Articles" })}</h2>

        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a._id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-sm text-slate-500">{a.category} • {new Date(a.createdAt).toLocaleDateString()}</div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(a)} className="rounded bg-blue-50 px-3 py-1 text-blue-600">{t("common.edit", { defaultValue: "Edit" })}</button>
                <button onClick={() => handleDelete(a._id)} className="rounded bg-red-50 px-3 py-1 text-red-600">{t("common.delete", { defaultValue: "Delete" })}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 dark:bg-slate-900">
            <h3 className="text-lg font-semibold">{t("adminArticles.editTitle", { defaultValue: "Edit Article" })}</h3>

            <label className="mt-4 block text-sm font-medium">{t("adminArticles.titleLabel", { defaultValue: "Title" })}</label>
            <input value={editing.title} onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))} className="mt-2 w-full rounded border px-3 py-2" />

            <label className="mt-4 block text-sm font-medium">{t("adminArticles.summaryLabel", { defaultValue: "Summary" })}</label>
            <textarea value={editing.summary} onChange={(e) => setEditing((s) => ({ ...s, summary: e.target.value }))} className="mt-2 w-full rounded border px-3 py-2" rows={3} />

            <label className="mt-4 block text-sm font-medium">{t("adminArticles.contentLabel", { defaultValue: "Content (Markdown)" })}</label>
            <textarea value={editing.content} onChange={(e) => setEditing((s) => ({ ...s, content: e.target.value }))} className="mt-2 w-full rounded border px-3 py-2" rows={8} />

            <label className="mt-4 block text-sm font-medium">{t("adminArticles.imageLabel", { defaultValue: "Image" })}</label>
            <div className="mt-2 flex items-center gap-3">
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; setImageFile(f || null); setImagePreview(f ? URL.createObjectURL(f) : ""); }} />
              {imagePreview && <img src={imagePreview} alt="preview" className="h-16 w-24 rounded object-cover border" />}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={cancelEdit} className="rounded px-4 py-2">{t("common.cancel", { defaultValue: "Cancel" })}</button>
              <button onClick={saveEdit} className="rounded bg-green-600 px-4 py-2 text-white">{t("common.save", { defaultValue: "Save" })}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAIArticles;
