import axios from "axios";
import * as actionType from "../constants/productConstants";

const apiUrl = process.env.REACT_APP_API_URL;

export const getProducts = () => async (dispatch) => {
  try {
    if (!apiUrl) throw new Error("Missing REACT_APP_API_URL");
    const { data } = await axios.get(`${apiUrl}/products/getProducts`);

    dispatch({ type: actionType.GET_PRODUCTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: actionType.GET_PRODUCTS_FAIL,
      payload: error.message,
    });
  }
};
