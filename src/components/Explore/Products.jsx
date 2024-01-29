import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/actions/cartAction";

const Products = ({ product }) => {
  const dispatch = useDispatch();
  const addToCartFun = (id) => {
    console.log(id);
    dispatch(addToCart(id, 1));
  };
  return (
    <div className="col-md-6 col-lg-4 col-xl-3 col-12 p-4">
      <div
        className="p-4 rounded border border-dark d-flex justify-content-between flex-column"
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <div>
          <img
            className="mb-5"
            src={product.url}
            alt=""
            style={{ width: "100%", height: "250px", objectFit: "contain" }}
          />
          <h2 className="mb-3">{product.title.shortTitle}</h2>
          <h5
            style={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "2",
            }}
            title={product.description}
          >
            {product.description}
            {/* The description needs to be set up */}
          </h5>
        </div>
        <button
          className="py-3 px-4 mt-5"
          style={{
            color: "white",
            fontFamily: "monospace",
            fontSize: "10pt",
            fontWeight: "bold",
            letterSpacing: "1px",
            backgroundColor: "green",
          }}
          onClick={() => addToCartFun(product.id)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Products;
