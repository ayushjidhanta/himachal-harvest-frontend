import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Pages and Components
import Home from "../components/Home/Home";
import Cart from "../components/Cart/Cart";
import About from "../components/About/About";
import Review from "../components/Review/review";
import Explore from "../components/Explore/Explore";
import SignIn from "../components/Auth/SignIn/SignIn";
import Checkout from "../components/Checkout/checkout";
import Privacy from "../components/PrivacyPolicy/privacy";
import NotFound from "../assets/PageNotFound/PageNotFound";
import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import SignUp from "../components/Auth/SignUp/SignUp";
import ContactUs from "../components/ContactUs/ContactUs";
import MyOrders from "../components/Orders/MyOrders";
import TrackOrder from "../components/Orders/TrackOrder";
import LiveTracking from "../components/Orders/LiveTracking";
import AdminFirstPage from "../components/Admin/AdminFirstPage";
import ManageProducts from "../components/Admin/ManageProducts";
import AdminOrders from "../components/Admin/AdminOrders";
import AdminDelivery from "../components/Admin/AdminDelivery";
import DeliveryPartner from "../components/Delivery/DeliveryPartner";
import PartnerDashboard from "../components/Partner/PartnerDashboard";
import AdminUsers from "../components/Admin/AdminUsers";
import { clearAuthUser, getAuthUser } from "../service/authUser";

export default function App() {
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);

  const login = useCallback((nextRole, nextUser) => {
    const r = String(nextRole || localStorage.getItem("role") || "").toLowerCase();
    setRole(r);
    setUser(nextUser || getAuthUser());
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("role");
      localStorage.removeItem("persist:root");
    } catch {}
    clearAuthUser();
    setRole("");
    setUser(null);
  }, []);

  useEffect(() => {
    login();
  }, [login]);

  const isAdminLoggedIn = role === "admin";
  const isPartnerLoggedIn = role === "partner";
  const isUserLoggedIn = role === "user";

  let routes;
  if (isAdminLoggedIn) {
    routes = (
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="*" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/explore" element={<Explore />} />
        <Route exact path="/checkout" element={<Checkout />} />
        <Route exact path="/my-orders" element={<MyOrders />} />
        <Route exact path="/track/:orderId" element={<TrackOrder />} />
        <Route exact path="/live/:token" element={<LiveTracking />} />
        <Route exact path="/delivery/:token" element={<DeliveryPartner />} />
        <Route exact path="/privacy" element={<Privacy />} />
        <Route exact path="/review" element={<Review />} />
        <Route exact path="/contactUs" element={<ContactUs/>}/>
        <Route exact path="/admin" element={<AdminFirstPage />} />
        <Route exact path="/admin/manage-products" element={<ManageProducts />} />
        <Route exact path="/admin/orders" element={<AdminOrders />} />
        <Route exact path="/admin/delivery" element={<AdminDelivery />} />
        <Route exact path="/admin/users" element={<AdminUsers />} />
      </Routes>
    );
  } else if (isPartnerLoggedIn) {
    routes = (
      <Routes>
        <Route exact path="/partner" element={<PartnerDashboard />} />
        <Route exact path="/delivery/:token" element={<DeliveryPartner />} />
        <Route exact path="/live/:token" element={<LiveTracking />} />
        <Route exact path="/privacy" element={<Privacy />} />
        <Route exact path="/contactUs" element={<ContactUs/>}/>
        <Route exact path="*" element={<PartnerDashboard />} />
      </Routes>
    );
  } else if (isUserLoggedIn) {
    routes = (
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="*" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/explore" element={<Explore />} />
        <Route exact path="/checkout" element={<Checkout />} />
        <Route exact path="/my-orders" element={<MyOrders />} />
        <Route exact path="/track/:orderId" element={<TrackOrder />} />
        <Route exact path="/live/:token" element={<LiveTracking />} />
        <Route exact path="/privacy" element={<Privacy />} />
        <Route exact path="/review" element={<Review />} />
        <Route exact path="/contactUs" element={<ContactUs/>}/>
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route exact path="/signin" element={<SignIn />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/" element={<SignIn />} />
        <Route exact path="/contactUs" element={<ContactUs/>}/>
        <Route exact path="/live/:token" element={<LiveTracking />} />
        <Route exact path="/delivery/:token" element={<DeliveryPartner />} />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isUserLoggedIn,
        isAdminLoggedIn,
        isPartnerLoggedIn,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>{routes}</BrowserRouter>;
    </AuthContext.Provider>
  );
}
