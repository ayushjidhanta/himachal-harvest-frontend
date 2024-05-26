import { createContext } from "react";

export const AuthContext = createContext({
  isUserLoggedIn: false,
  isAdminLoggedIn: false,
  login: () => {},
  logout: () => {},
});