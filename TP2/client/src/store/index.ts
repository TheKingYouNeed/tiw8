import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';
import type { RootState } from '../models';
import { socketMiddleware } from './middleware/socketMiddleware';
import loggerMiddleware from './middleware/loggerMiddleware';

// Create the store
const storeConfig = {
  reducer: {
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(loggerMiddleware, socketMiddleware),
};

export const store = configureStore(storeConfig);

// Expose store to window for debugging
declare global {
  interface Window {
    mystore: unknown;
  }
}
window.mystore = store;

// Export types
export type AppDispatch = typeof store.dispatch;
export type { RootState } from '../models';
