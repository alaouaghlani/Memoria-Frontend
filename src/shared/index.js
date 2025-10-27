import { combineReducers, createStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import { rootSlice } from './slice/rootSlice';
import { authentificationSlice } from './slice/Auth/AuthSlice';
import { olderAdultSlice } from './slice/OlderAdult/OlderAdultSlice';
import { closeAdultSlice } from './slice/CloseAdult/CloseAdultSlice';

// export const BaseURI = 'http://10.0.2.2:9000';
// export const BaseURI = 'https://192.168.1.2:9000';
export const BaseURI = 'http://192.168.1.26:9000';
// export const BaseURI = 'https://test.realitybird.com/memoria-backend/';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['root', 'authentification'],
};

const rootReducer = combineReducers({
  root: rootSlice.reducer,
  authentification: authentificationSlice.reducer,
  olderAdult: olderAdultSlice.reducer,
  closeAdult: closeAdultSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
