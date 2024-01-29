import React from "react";
import Navbar2 from "../Home/Navbar2";
// import "./Explore.css";
// import SliderExp from "../Sliders/SliderExp";
import Products from "./Products";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProducts } from "../../redux/actions/productAction";
import Footer from "../../assets/Footer/Footer";
export default function Exploree() {
  const dispatch = useDispatch();

  useEffect(() => {
     dispatch(getProducts());
  }, [dispatch]);

  const { products } = useSelector((state) => state.getProducts);

  return (
    <>
      <Navbar2 />
      <div className="margin-box">
        <h1>Explore 2</h1>
      </div>
      {/* <SliderExp /> */}
      <div className="container">
        <div className="row">
          {products &&
            products.map((product) => {
              return <Products product={product} key={product.id}></Products>;
            })}
        </div>
      </div>
      <Footer />
    </>
  );
}
