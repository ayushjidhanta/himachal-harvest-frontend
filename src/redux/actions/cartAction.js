import * as actionType from "../constants/cartConstants";
import { fetchProductById } from "../../features/products/productApi";

export const addToCart = (id, quantity = 1) => async (dispatch) => {
  try {
    const { data } = await fetchProductById(id);

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
