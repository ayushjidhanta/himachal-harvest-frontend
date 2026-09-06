export const selectProductCatalog = (state) => state.productCatalog;
export const selectProducts = (state) => selectProductCatalog(state).products;
