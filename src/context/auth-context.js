import { createContext } from "react";

export const AuthContext = createContext({
  role: "",
  user: null,
  isUserLoggedIn: false,
  isAdminLoggedIn: false,
  isPartnerLoggedIn: false,
  login: () => {},
  logout: () => {},
});
