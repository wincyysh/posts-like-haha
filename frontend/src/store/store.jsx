// frontend/src/store/store.jsx
import { configureStore } from '@reduxjs/toolkit';
import feedSlice from './feedSlices';

export const store = configureStore({
  reducer: {
    feed: feedSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;