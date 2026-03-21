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
import Roles from "../enum/Roles";
import ContactUs from "../components/ContactUs/ContactUs";
import MyOrders from "../components/Orders/MyOrders";
import AdminFirstPage from "../components/Admin/AdminFirstPage";
import ManageProducts from "../components/Admin/ManageProducts";
import AdminOrders from "../components/Admin/AdminOrders";

export default function App() {
  const [isUserLoggedIn, setisUserLoggedIn] = useState();
  const [isAdminLoggedIn, setisAdminLoggedIn] = useState();

  const login = useCallback(async (role) => {
    const getLoggedInfo = localStorage.getItem("role");
    if (getLoggedInfo === Roles.ADMIN.toLowerCase()) {
      setisAdminLoggedIn(getLoggedInfo);
    } else {
      setisUserLoggedIn(getLoggedInfo);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("role");
      localStorage.removeItem("persist:root");
    } catch {}
    setisUserLoggedIn(undefined);
    setisAdminLoggedIn(undefined);
  }, []);

  useEffect(() => {
    const getLoggedInfo = localStorage.getItem("role");
    if (getLoggedInfo) {
      login(getLoggedInfo);
    } else {
      login(getLoggedInfo);
    }
  }, [isUserLoggedIn, login, isAdminLoggedIn]);

  let routes;
  if (isUserLoggedIn || isAdminLoggedIn) {
    routes = (
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="*" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/explore" element={<Explore />} />
        <Route exact path="/checkout" element={<Checkout />} />
        <Route exact path="/my-orders" element={<MyOrders />} />
        <Route exact path="/privacy" element={<Privacy />} />
        <Route exact path="/review" element={<Review />} />
        <Route exact path="/contactUs" element={<ContactUs/>}/>
        <Route exact path="/admin" element={<AdminFirstPage />} />
        <Route exact path="/admin/manage-products" element={<ManageProducts />} />
        <Route exact path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    );
  } else if (!isUserLoggedIn) {
    routes = (
      <Routes>
        <Route exact path="/signin" element={<SignIn />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/" element={<SignIn />} />
        <Route exact path="/contactUs" element={<ContactUs/>}/>
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isUserLoggedIn: isUserLoggedIn,
        isAdminLoggedIn: isAdminLoggedIn,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>{routes}</BrowserRouter>;
    </AuthContext.Provider>
  );
}
