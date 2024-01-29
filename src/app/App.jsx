import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages and Components
import Home from "../components/Home/Home";
import Cart from "../components/Cart/Cart";
import About from "../components/About/About";
import Signup from "../components/Auth/SignUp/SignUp";
import Review from "../components/Review/review";
import Explore from "../components/Explore/Explore";
import SignIn from "../components/Auth/SignIn/SignIn";
import Checkout from "../components/Checkout/checkout";
import Privacy from "../components/PrivacyPolicy/privacy";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/signin" element={<SignIn />} />
        {/* <Route exact path="/about" element={<About />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/explore" element={<Explore />} />
        <Route exact path="/checkout" element={<Checkout />} />
        <Route exact path="/privacy" element={<Privacy />} />
        <Route exact path="/review" element={<Review />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
