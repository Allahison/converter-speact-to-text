import { configureStore } from '@reduxjs/toolkit';
import speechReducer from './speechSlice';

const store = configureStore({
  reducer: {
    speech: speechReducer,
  },
});

export default store;
