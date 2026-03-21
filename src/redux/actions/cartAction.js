import axios from "axios";
import * as actionType from "../constants/cartConstants";

const apiUrl = process.env.REACT_APP_API_URL;

export const addToCart = (id, quantity = 1) => async (dispatch) => {
  try {
    if (!apiUrl) throw new Error("Missing REACT_APP_API_URL");
    const { data } = await axios.get(`${apiUrl}/products/getProducts/${id}`);

    dispatch({
      type: actionType.ADD_TO_CART,
      payload: { ...data, quantity },
    });
  } catch (error) {
    dispatch({ type: actionType.ADD_TO_CART_ERROR, payload: error.message });
  }
};

export const updateCartQuantity = (id, quantity) => (dispatch) => {
  dispatch({ type: actionType.UPDATE_CART_QUANTITY, payload: { id, quantity } });
};

export const removeFromCart = (id) => (dispatch) => {
  dispatch({ type: actionType.REMOVE_FROM_CART, payload: id });
};

export const resetCart = () => (dispatch) => {
  dispatch({ type: actionType.CART_RESET });
};
