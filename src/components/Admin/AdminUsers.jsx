import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar2 from "../Home/Navbar2";
import Footer from "../../assets/Footer/Footer";
import { SpinnerHimachalHarvest } from "../../assets/Spinner/Spinner";
import { AuthContext } from "../../context/auth-context";
import AdminKeyCard from "./AdminKeyCard";
import { getAdminKey } from "../../service/adminKey";
import AdminNavigationTabs from "./AdminNavigationTabs";
import layout from "./AdminLayout.module.css";
import styles from "./AdminUsers.module.css";
import { MANAGER_PERMISSION_OPTIONS, USER_ROLE_OPTIONS } from "../../constants/userRoles";
import Toast, { useToast } from "../common/Toast/Toast";

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminUsers() {
  const auth = useContext(AuthContext);
  const { toast, showToast, dismissToast } = useToast();
  const [adminKey, setAdminKey] = useState(getAdminKey());

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");
  const isAdmin = auth?.isAdminLoggedIn;

  const accessToken = auth?.user?.accessToken || "";
  const headers = useMemo(() => {
    const nextHeaders = {};
    if (adminKey) nextHeaders["x-admin-key"] = adminKey;
    if (accessToken) nextHeaders.Authorization = `Bearer ${accessToken}`;
    return nextHeaders;
  }, [accessToken, adminKey]);

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

  const updateRole = async (username, role, permissions) => {
    setError("");
    setBanner("");
    if (!API_URL) return;

    setLoading(true);
    try {
      const { data } = await axios.patch(
        `${API_URL}/admin/users/${encodeURIComponent(username)}`,
        { role, permissions },
        { headers }
      );
      const updated = data?.data;
      if (updated) {
        setUsers((prev) => prev.map((u) => (u.username === updated.username ? updated : u)));
      }
      setBanner(`Updated role for ${username}`);
      showToast(`Role updated for ${username}.`, "success");
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error?.message || err?.message || "Failed to update role";
      if ((status === 401 || status === 403) && !adminKey) {
        setError(`${status}: ${msg}. Missing Admin API Key (backend ADMIN_API_KEY is likely set).`);
      } else {
        setError(status ? `${status}: ${msg}` : msg);
      }
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin && !auth?.isManagerLoggedIn) {
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
      <Toast toast={toast} onDismiss={dismissToast} />

      <div className={layout.header}>
        <div className={layout.container}>
          <div className={layout.headerInner}>
            <div>
              <h1 className={layout.title}>Users</h1>
              <div className={layout.sub}>{isAdmin ? "Assign roles. Users must logout/login to see changes." : "User directory (read-only)"}</div>
            </div>
            <AdminNavigationTabs active="users" />
          </div>
        </div>
      </div>

      <div className={layout.body}>
        <div className={layout.container + " " + layout.scroll}>
          {banner ? <div className={layout.banner}>{banner}</div> : null}
          {error ? <div className={layout.alert}>{error}</div> : null}

          {isAdmin ? <AdminKeyCard adminKey={adminKey} setAdminKey={setAdminKey} /> : null}

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
                  <UserRow key={u.username} user={u} onSave={updateRole} readOnly={!isAdmin} />
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

function UserRow({ user, onSave, readOnly }) {
  const [role, setRole] = useState(user?.role || "User");
  const [permissions, setPermissions] = useState(user?.permissions || []);
  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    setRole(user?.role || "User");
    setPermissions(Array.isArray(user?.permissions) ? user.permissions : []);
  }, [user?.role, user?.permissions]);

  const togglePermission = (permission) => {
    setPermissions((current) =>
      current.includes(permission) ? current.filter((value) => value !== permission) : [...current, permission]
    );
  };

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    if (nextRole !== "Manager") setPermissions([]);
  };

  return (
    <>
      <tr>
        <td style={{ fontWeight: 900 }}>{user.username}</td>
        <td>{user.email}</td>
        <td>
          <select className={styles.select} value={role} onChange={(e) => handleRoleChange(e.target.value)} disabled={isAdmin || readOnly}>
            {USER_ROLE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </td>
        <td style={{ textAlign: "right" }}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={() => onSave(user.username, role, permissions)} disabled={isAdmin || readOnly}>
            {isAdmin ? "Protected" : readOnly ? "Read-only" : "Save"}
          </button>
        </td>
      </tr>
      {role === "Manager" && !isAdmin ? (
        <tr className={styles.permissionRow}>
          <td colSpan={4}>
            <div className={styles.permissionTitle}>Manager permissions</div>
            <div className={styles.permissions}>
              {MANAGER_PERMISSION_OPTIONS.map(({ value, label }) => (
                <label className={styles.permission} key={value}>
                  <input type="checkbox" checked={permissions.includes(value)} onChange={() => togglePermission(value)} disabled={readOnly} />
                  {label}
                </label>
              ))}
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
