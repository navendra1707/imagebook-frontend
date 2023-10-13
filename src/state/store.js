import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PURGE,
  REGISTER,
  PERSIST,
} from "redux-persist"; // to store the information of the user even if user closes the tab
import storage from "redux-persist/lib/storage";
import authReducer from './index';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // for making asynchronous requests, actions, etc
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, REHYDRATE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
