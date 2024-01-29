import React from "react";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/actions/cartAction";
// import "./Cart.css";

const CartItem = ({ item }) => {
  const shortDescription = (text) => {
    if (text.length >= 25) {
      return text.substring(0, 25) + "...";
    }
  };
   const dispatch = useDispatch();

  const removeItem = (id) => {
    console.log(id);
    dispatch(removeFromCart(id));
  };
  return (
    <div>
      <div className="items-info">
        <div className="product-img">
          <img src={item.url} alt="" />
        </div>
        <div className="title">
          <h2>{item?.title?.shortTitle}</h2>
          <p>{shortDescription(item.description)}</p>
        </div>
        <div className="add-minus-quantity" style={{ alignItems: "center" }}>
          <i className="fas fa-minus minus"></i>
          <h2>1</h2>
          <i className="fas fa-plus add"></i>
        </div>
        <div className="price">
          <h3>₹ {item.price.cost}</h3>
        </div>
        <div className="remove-item" onClick={() => removeItem(item.id)}>
          <i className="fas fa-trash-alt remove"></i>
        </div>
      </div>
      <hr/>
    </div>
  );
};

export default CartItem;
