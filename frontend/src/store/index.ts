import { configureStore } from '@reduxjs/toolkit';
import servicesReducer from './servicesSlice';
import ticketsReducer from './ticketsSlice';
import adminReducer from '../features/admin/store/adminSlice';

export const store = configureStore({
  reducer: {
    services: servicesReducer,
    tickets: ticketsReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
