// src/store.js
import { createStore, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import rootReducer from "./services/Reducer/combineReducer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['employee'] // sirf employee slice persist hogi
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);


export const persistor = persistStore(store);
