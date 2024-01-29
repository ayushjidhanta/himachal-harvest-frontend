import axios from "axios";
import * as actionType from "../constants/cartConstants";

const apiUrl = "";

export const addToCart = (id, quantity) => async (dispatch) => {
  try {
    const { data } = await axios.get(`${apiUrl}/products/getProducts/${id}`);

    // check if it data also in cart or not
    // const response = await saveCartDetails(data);

    // if (response === 409) {
    //   console.log("Already in cart can't add one item two times....");
    //   return;
    // }

    console.log("Redux", JSON.parse(data));

    dispatch({
      type: actionType.ADD_TO_CART,
      payload: { ...JSON.parse(data), quantity },
    });
  } catch (error) {
    dispatch({ type: actionType.ADD_TO_CART_ERROR, payload: error.message });
  }
};

export const removeFromCart = (id) => (dispatch) => {
  dispatch({ type: actionType.REMOVE_FROM_CART, payload: id });
};
