import axios from "axios";
import * as actionType from "../constants/productConstants";

const apiUrl = "";
export const getProducts = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${apiUrl}/products/getProducts`);

    console.log(data);

    dispatch({ type: actionType.GET_PRODUCTS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({
      type: actionType.GET_PRODUCTS_FAIL,
      payload: error.message,
    });
  }
};
