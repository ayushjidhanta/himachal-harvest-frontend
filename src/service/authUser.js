const USER_KEY = "authUser";

export const getAuthUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user || null));
  } catch {}
};

export const clearAuthUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {}
};

