const STORAGE_KEY = "adminApiKey";

export const getAdminKey = () => {
  const envKey = process.env.REACT_APP_ADMIN_API_KEY;
  if (envKey) return envKey;

  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
};

export const setAdminKey = (key) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(key || "").trim());
  } catch {}
};

export const adminHeaders = () => {
  const key = getAdminKey();
  return key ? { "x-admin-key": key } : {};
};

