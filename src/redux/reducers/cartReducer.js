import * as actionType from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case actionType.ADD_TO_CART: {
      const item = action.payload;
      const exist = state.cartItems.find((product) => product.id === item.id);

      if (exist) {
        const addQty = Number(item.quantity || 1);
        return {
          ...state,
          cartItems: state.cartItems.map((p) =>
            p.id === item.id
              ? { ...p, quantity: Number(p.quantity || 1) + addQty }
              : p
          ),
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, { ...item, quantity: Number(item.quantity || 1) }],
      };
    }

    case actionType.UPDATE_CART_QUANTITY: {
      const { id, quantity } = action.payload || {};
      const nextQty = Number(quantity);

      if (!id) return state;
      if (!Number.isFinite(nextQty)) return state;

      if (nextQty <= 0) {
        return {
          ...state,
          cartItems: state.cartItems.filter((p) => p.id !== id),
        };
      }

      return {
        ...state,
        cartItems: state.cartItems.map((p) =>
          p.id === id ? { ...p, quantity: nextQty } : p
        ),
      };
    }

    case actionType.REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((product) => product.id !== action.payload),
      };

    case actionType.CART_RESET:
      return { cartItems: [] };

    default:
      return state;
  }
};
