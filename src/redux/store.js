import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { productCatalogReducer } from '../features/products/productReducer';
import { adminOrderCatalogReducer } from '../features/orders/orderReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { cartReducer } from './reducers/cartReducer';
import {createMigrate, persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { persistMigrations } from './persistMigrations';

const persistConfig = {
    key : "root",
    storage,
    version: 1,
    migrate: createMigrate(persistMigrations, { debug: false }),
    blacklist: ["adminOrderCatalog"],
}
const reducer = combineReducers({
    productCatalog: productCatalogReducer,
    adminOrderCatalog: adminOrderCatalogReducer,
    cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const middleware = [thunk];
const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middleware)));

const persistor = persistStore(store);
export {persistor}
export default store;
