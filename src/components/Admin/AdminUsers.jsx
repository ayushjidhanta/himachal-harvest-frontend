import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import { AuthContext } from "../../context/auth-context";
import AdminKeyCard from "./AdminKeyCard";
import { getAdminKey } from "../../service/adminKey";
import layout from "./AdminLayout.module.css";
import styles from "./AdminUsers.module.css";

const API_URL = process.env.REACT_APP_API_URL;

const ROLES = ["User", "Partner", "Admin"];

export default function AdminUsers() {
  const auth = useContext(AuthContext);
  const [adminKey, setAdminKey] = useState(getAdminKey());

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");

  const headers = useMemo(() => {
    const h = {};
    if (adminKey) h["x-admin-key"] = adminKey;
    return h;
  }, [adminKey]);

  const fetchUsers = useCallback(async () => {
    setError("");
    setBanner("");
    if (!API_URL) {
      setError("Missing REACT_APP_API_URL");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/admin/users`, { headers });
      setUsers(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.message || "Failed to load users";
      if ((status === 401 || status === 403) && !adminKey) {
        setError(`${status}: ${msg}. Missing Admin API Key (backend ADMIN_API_KEY is likely set).`);
      } else {
        setError(status ? `${status}: ${msg}` : msg);
      }
    } finally {
      setLoading(false);
    }
  }, [adminKey, headers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return (users || []).filter((u) => `${u.username} ${u.email} ${u.role}`.toLowerCase().includes(q));
  }, [users, query]);

  const updateRole = async (username, role) => {
    setError("");
    setBanner("");
    if (!API_URL) return;

    setLoading(true);
    try {
      const { data } = await axios.patch(`${API_URL}/admin/users/${encodeURIComponent(username)}`, { role }, { headers });
      const updated = data?.data;
      if (updated) {
        setUsers((prev) => prev.map((u) => (u.username === updated.username ? updated : u)));
      }
      setBanner(`Updated role for ${username}`);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.message || "Failed to update role";
      if ((status === 401 || status === 403) && !adminKey) {
        setError(`${status}: ${msg}. Missing Admin API Key (backend ADMIN_API_KEY is likely set).`);
      } else {
        setError(status ? `${status}: ${msg}` : msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!auth?.isAdminLoggedIn) {
    return (
      <>
        <Navbar2 />
        <div className={layout.shell}>
          <div className={layout.header}>
            <div className={layout.container}>
              <div className={layout.headerInner}>
                <div>
                  <h1 className={layout.title}>Admin</h1>
                  <div className={layout.sub}>Not authorized</div>
                </div>
              </div>
            </div>
          </div>
          <div className={layout.body}>
            <div className={layout.container} style={{ padding: "1rem 0" }}>
              <div className={layout.card}>You need to be logged in as Admin.</div>
            </div>
          </div>
          <div className={layout.footer}>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={layout.shell}>
      <Navbar2 />
      <SpinnerHimachalHarvest show={loading} />

      <div className={layout.header}>
        <div className={layout.container}>
          <div className={layout.headerInner}>
            <div>
              <h1 className={layout.title}>Users</h1>
              <div className={layout.sub}>Assign roles (User / Partner / Admin). Users must logout/login to see changes.</div>
            </div>
            <div className={layout.tabs}>
              <Link className={layout.tab} to="/admin">Add Product</Link>
              <Link className={layout.tab} to="/admin/manage-products">Manage Products</Link>
              <Link className={layout.tab} to="/admin/orders">Orders</Link>
              <Link className={layout.tab} to="/admin/delivery">Delivery</Link>
              <Link className={`${layout.tab} ${layout.tabActive}`} to="/admin/users">Users</Link>
            </div>
          </div>
        </div>
      </div>

      <div className={layout.body}>
        <div className={layout.container + " " + layout.scroll}>
          {banner ? <div className={layout.banner}>{banner}</div> : null}
          {error ? <div className={layout.alert}>{error}</div> : null}

          <AdminKeyCard adminKey={adminKey} setAdminKey={setAdminKey} />

          <div className={layout.card}>
            <div className={styles.controls}>
              <input
                className={styles.search}
                placeholder="Search username/email/role..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className={styles.btn} type="button" onClick={fetchUsers}>
                Refresh
              </button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <UserRow key={u.username} user={u} onSave={updateRole} />
                ))}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ color: "#666", padding: "1rem 0" }}>
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={layout.footer}>
        <Footer />
      </div>
    </div>
  );
}

function UserRow({ user, onSave }) {
  const [role, setRole] = useState(user?.role || "User");

  useEffect(() => {
    setRole(user?.role || "User");
  }, [user?.role]);

  return (
    <tr>
      <td style={{ fontWeight: 900 }}>{user.username}</td>
      <td>{user.email}</td>
      <td>
        <select className={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </td>
      <td style={{ textAlign: "right" }}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={() => onSave(user.username, role)}>
          Save
        </button>
      </td>
    </tr>
  );
}
