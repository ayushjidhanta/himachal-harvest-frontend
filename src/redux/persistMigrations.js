// Preserve the existing local product cache while moving to the feature-oriented
// `productCatalog` state key.
export const persistMigrations = {
  1: (state) => {
    if (!state?.productCatalog && state?.getProducts) {
      const { getProducts, ...rest } = state;
      return { ...rest, productCatalog: getProducts };
    }
    return state;
  },
};
