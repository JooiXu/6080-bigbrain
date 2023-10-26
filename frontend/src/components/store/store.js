import appReducer from './slices/app';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({ reducer: { app: appReducer, } });

export default store;
