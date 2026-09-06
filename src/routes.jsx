import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Cart from "./components/Cart/Cart";
import About from "./components/About/About";
import Review from "./components/Review/review";
import Explore from "./components/Explore/Explore";
import SignIn from "./components/Auth/SignIn/SignIn";
import Checkout from "./components/Checkout/checkout";
import Privacy from "./components/PrivacyPolicy/privacy";
import NotFound from "./assets/PageNotFound/PageNotFound";
import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./context/auth-context";
import SignUp from "./components/Auth/SignUp/SignUp";
import ContactUs from "./components/ContactUs/ContactUs";
import MyOrders from "./components/Orders/MyOrders";
import TrackOrder from "./components/Orders/TrackOrder";
import LiveTracking from "./components/Orders/LiveTracking";
import AdminFirstPage from "./components/Admin/AdminFirstPage";
import ManageProducts from "./components/Admin/ManageProducts";
import AdminOrders from "./components/Admin/AdminOrders";
import AdminDelivery from "./components/Admin/AdminDelivery";
import DeliveryPartner from "./components/Delivery/DeliveryPartner";
import PartnerDashboard from "./components/Partner/PartnerDashboard";
import AdminUsers from "./components/Admin/AdminUsers";
import { clearAuthUser, getAuthUser } from "./service/authUser";
import { normalizeUserRole, USER_ROLE } from "./constants/userRoles";


import { useContext } from "react";
import { useLocation } from "react-router-dom";

const normalizeRole = normalizeUserRole;


export function RequireRole({ allow = [], children }) {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const role = normalizeRole(auth?.role) || "guest";

  console.log("RequireRole", { role, allow });

  if (allow.includes(role)) return children;

  return <Navigate to="/signin" replace state={{ from: location }} />;
}





export default function App() {
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);

  const login = useCallback((nextRole, nextUser) => {
    const r = normalizeRole(nextRole || localStorage.getItem("role") || "");
    setRole(r);
    setUser(nextUser || getAuthUser());
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("role");
      localStorage.removeItem("persist:root");
    } catch { }
    clearAuthUser();
    setRole("");
    setUser(null);
  }, []);

  useEffect(() => {
    login();
  }, [login]);

  const isAdminLoggedIn = role === USER_ROLE.ADMIN;
  const isManagerLoggedIn = role === USER_ROLE.MANAGER;
  const isUserLoggedIn = role === USER_ROLE.USER;
  const isPartnerLoggedIn = role === USER_ROLE.DELIVERY_PARTNER;
  const isLoggedIn = isAdminLoggedIn || isManagerLoggedIn || isUserLoggedIn || isPartnerLoggedIn;

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isUserLoggedIn,
        isAdminLoggedIn,
        isManagerLoggedIn,
        isPartnerLoggedIn,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contactUs" element={<ContactUs />} />

          <Route path="/signin" element={isLoggedIn ? <Navigate to="/" replace /> : <SignIn />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : <SignUp />} />

          <Route path="/live/:token" element={<LiveTracking />} />
          <Route path="/delivery/:token" element={<DeliveryPartner />} />

          <Route
            path="/checkout"
            element={
              <RequireRole allow={["user", "admin"]}>
                <Checkout />
              </RequireRole>
            }
          />
          <Route
            path="/my-orders"
            element={
              <RequireRole allow={["user", "admin"]}>
                <MyOrders />
              </RequireRole>
            }
          />
          <Route
            path="/track/:orderId"
            element={
              <RequireRole allow={["user", "admin"]}>
                <TrackOrder />
              </RequireRole>
            }
          />
          <Route
            path="/review"
            element={
              <RequireRole allow={["guest", "user", "admin"]}>
                <Review />
              </RequireRole>
            }
          />

          <Route
            path="/admin/products"
            element={
              <RequireRole allow={["admin"]}>
                <AdminFirstPage />
              </RequireRole>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
          <Route
            path="/admin/listing"
            element={
              <RequireRole allow={["admin"]}>
                <ManageProducts />
              </RequireRole>
            }
          />
          <Route path="/admin/manage-products" element={<Navigate to="/admin/listing" replace />} />
          <Route
            path="/admin/orders"
            element={
              <RequireRole allow={["admin"]}>
                <AdminOrders />
              </RequireRole>
            }
          />
          <Route
            path="/admin/delivery"
            element={
              <RequireRole allow={["admin"]}>
                <AdminDelivery />
              </RequireRole>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireRole allow={["admin"]}>
                <AdminUsers />
              </RequireRole>
            }
          />

          <Route
            path="/manager"
            element={
              <RequireRole allow={["manager"]}>
                <PartnerDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/partner"
            element={
              <RequireRole allow={[USER_ROLE.DELIVERY_PARTNER]}>
                <PartnerDashboard />
              </RequireRole>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
