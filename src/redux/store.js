import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { getProductsReducer } from './reducers/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { cartReducer } from './reducers/cartReducer';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key : "root",
    storage
}
const reducer = combineReducers({
    getProducts: getProductsReducer,
    cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const middleware = [thunk];
const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middleware)));

const persistor = persistStore(store);
export {persistor}
export default store;