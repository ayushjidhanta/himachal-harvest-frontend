
import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import { AuthContext } from "../../context/auth-context";
import styles from "./AdminFirstPage.module.css";

const API_URL = process.env.REACT_APP_API_URL;
const ADMIN_KEY = process.env.REACT_APP_ADMIN_API_KEY;

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AdminFirstPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [imageMode, setImageMode] = useState("upload");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const [form, setForm] = useState({
    id: "",
    shortTitle: "",
    longTitle: "",
    mrp: "",
    cost: "",
    quantity: "1",
    discount: "",
    tagline: "",
    seller: "",
    description: "",
    detailUrl: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const computedPreview = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (imageMode === "url") return imageUrl.trim();
    return "";
  }, [imageMode, imageUrl, previewUrl]);

  const resetAll = () => {
    setImageFile(null);
    setImageUrl("");
    setPreviewUrl("");
    setForm({
      id: "",
      shortTitle: "",
      longTitle: "",
      mrp: "",
      cost: "",
      quantity: "1",
      discount: "",
      tagline: "",
      seller: "",
      description: "",
      detailUrl: "",
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!API_URL) {
      setError("Missing REACT_APP_API_URL in frontend env");
      return;
    }

    const shortTitle = form.shortTitle.trim();
    const longTitle = form.longTitle.trim();
    const mrp = Number(form.mrp);
    const cost = Number(form.cost);
    const quantity = Number(form.quantity);

    if (!shortTitle) return setError("Short title is required");
    if (!Number.isFinite(mrp) || mrp < 0) return setError("MRP must be a number >= 0");
    if (!Number.isFinite(cost) || cost < 0) return setError("Cost must be a number >= 0");
    if (!Number.isFinite(quantity) || quantity < 0) return setError("Quantity must be a number >= 0");

    let finalUrl = "";
    if (imageMode === "upload") {
      if (!imageFile) return setError("Please select an image file");
      if (imageFile.size > 2.5 * 1024 * 1024) {
        return setError("Image is too large (max 2.5MB). Use a smaller image or Image URL.");
      }
      setSubmitting(true);
      try {
        finalUrl = await fileToDataUrl(imageFile);
      } catch {
        setSubmitting(false);
        return setError("Failed to read image file");
      }
    } else {
      finalUrl = imageUrl.trim();
      if (!finalUrl) return setError("Please provide an image URL");
    }

    const payload = {
      id: form.id.trim() || undefined,
      url: finalUrl,
      detailUrl: form.detailUrl.trim() || undefined,
      title: {
        shortTitle,
        longTitle: longTitle || shortTitle,
      },
      price: {
        mrp,
        cost,
      },
      quantity,
      discount: form.discount.trim(),
      tagline: form.tagline.trim(),
      seller: form.seller.trim(),
      description: form.description.trim(),
    };

    setSubmitting(true);
    try {
      const headers = {};
      if (ADMIN_KEY) headers["x-admin-key"] = ADMIN_KEY;

      const { data } = await axios.post(`${API_URL}/products`, payload, { headers });

      const createdId = data?.data?.id || data?.data?._id || "";
      setSuccess({ order: createdId, raw: data });
      resetAll();
    } catch (err) {
      const status = err?.response?.status;
      const backendMsg = err?.response?.data?.error?.message || err?.response?.data?.message;
      const msg = backendMsg || err?.message || "Failed to create product";

      if ((status === 401 || status === 403) && !ADMIN_KEY) {
        setError(`${status}: ${msg}. Missing REACT_APP_ADMIN_API_KEY (and backend ADMIN_API_KEY may be set).`);
      } else {
        setError(status ? `${status}: ${msg}` : msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!auth?.isAdminLoggedIn) {
    return (
      <>
        <Navbar2 />
        <div className={styles.page}>
          <div className={styles.card}>
            <div className={styles.titleRow}>
              <h1 className={styles.h1}>Admin</h1>
              <p className={styles.sub}>Not authorized</p>
            </div>
            <p>You need to be logged in as Admin to access this page.</p>
            <div className={styles.actions}>
              <button className={`${styles.button} ${styles.secondary}`} onClick={() => navigate("/")}>
                Go Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar2 />
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.h1}>Admin — Add Product</h1>
              <p className={styles.sub}>Creates a product using the existing Product schema</p>
            </div>
            <button
              type="button"
              className={`${styles.button} ${styles.secondary}`}
              onClick={() => navigate("/explore")}
            >
              View Products
            </button>
          </div>

          <div className={styles.row} style={{ justifyContent: "flex-start", marginBottom: "1rem" }}>
            <Link className={`${styles.button} ${styles.secondary}`} to="/admin">
              Add Product
            </Link>
            <Link className={`${styles.button} ${styles.secondary}`} to="/admin/manage-products">
              Manage Products
            </Link>
            <Link className={`${styles.button} ${styles.secondary}`} to="/admin/orders">
              Orders
            </Link>
          </div>

          <form onSubmit={submit}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <div className={styles.label}>Product ID (optional)</div>
                <input
                  className={styles.input}
                  value={form.id}
                  onChange={(e) => update("id", e.target.value)}
                  placeholder="Leave empty to auto-generate"
                />
                <div className={styles.small}>Must be unique if provided.</div>
              </div>

              <div className={styles.previewWrap}>
                <div className={styles.row}>
                  <div className={styles.pills}>
                    <button
                      type="button"
                      className={`${styles.pill} ${imageMode === "upload" ? styles.pillActive : ""}`}
                      onClick={() => {
                        setImageMode("upload");
                        setPreviewUrl("");
                      }}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      className={`${styles.pill} ${imageMode === "url" ? styles.pillActive : ""}`}
                      onClick={() => {
                        setImageMode("url");
                        setPreviewUrl("");
                        setImageFile(null);
                      }}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {imageMode === "upload" ? (
                  <div className={styles.field}>
                    <div className={styles.label}>Product image</div>
                    <input
                      className={styles.input}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setImageFile(f);
                        setPreviewUrl(f ? URL.createObjectURL(f) : "");
                      }}
                    />
                    <div className={styles.small}>Stored as data URL in `url` (max 2.5MB).</div>
                  </div>
                ) : (
                  <div className={styles.field}>
                    <div className={styles.label}>Image URL</div>
                    <input
                      className={styles.input}
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                )}

                {computedPreview ? (
                  <img className={styles.preview} src={computedPreview} alt="Preview" />
                ) : (
                  <div className={styles.small}>Image preview will appear here.</div>
                )}
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Short title *</div>
                <input
                  className={styles.input}
                  value={form.shortTitle}
                  onChange={(e) => update("shortTitle", e.target.value)}
                  placeholder="e.g., Apple Jam"
                  required
                />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Long title</div>
                <input
                  className={styles.input}
                  value={form.longTitle}
                  onChange={(e) => update("longTitle", e.target.value)}
                  placeholder="e.g., Homemade Apple Jam (500g)"
                />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>MRP *</div>
                <input
                  className={styles.input}
                  type="number"
                  value={form.mrp}
                  onChange={(e) => update("mrp", e.target.value)}
                  placeholder="e.g., 299"
                  min="0"
                  required
                />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Cost *</div>
                <input
                  className={styles.input}
                  type="number"
                  value={form.cost}
                  onChange={(e) => update("cost", e.target.value)}
                  placeholder="e.g., 199"
                  min="0"
                  required
                />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Quantity</div>
                <input
                  className={styles.input}
                  type="number"
                  value={form.quantity}
                  onChange={(e) => update("quantity", e.target.value)}
                  min="0"
                />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Discount (text)</div>
                <input
                  className={styles.input}
                  value={form.discount}
                  onChange={(e) => update("discount", e.target.value)}
                  placeholder="e.g., 20% off"
                />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Seller</div>
                <input
                  className={styles.input}
                  value={form.seller}
                  onChange={(e) => update("seller", e.target.value)}
                  placeholder="e.g., Himachal Harvest"
                />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Tagline</div>
                <input
                  className={styles.input}
                  value={form.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                  placeholder="Short punchline"
                />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>Detail URL (optional)</div>
                <input
                  className={styles.input}
                  value={form.detailUrl}
                  onChange={(e) => update("detailUrl", e.target.value)}
                  placeholder="If empty, uses main image/url"
                />
              </div>

              <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
                <div className={styles.label}>Description</div>
                <textarea
                  className={styles.textarea}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Product description..."
                />
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.button} ${styles.primary}`}
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Product"}
              </button>
              <button
                className={`${styles.button} ${styles.danger}`}
                type="button"
                onClick={resetAll}
                disabled={submitting}
              >
                Reset
              </button>
            </div>
          </form>

          {success && (
            <div className={styles.banner}>
              Product created successfully.
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.small} style={{ marginTop: "1rem" }}>
            Tip: set `REACT_APP_ADMIN_API_KEY` in frontend and `ADMIN_API_KEY` on the backend to protect product creation.
          </div>
        </div>
      </div>
    </>
  );
}
