import { combineReducers, createStore } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import { rootSlice } from "./slice/rootSlice"
import { authentificationSlice } from "./slice/Auth/AuthSlice";


export const BaseURI = 'http://192.168.1.7:3001';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['root', 'authentification'],
};

const rootReducer = combineReducers({
    root: rootSlice.reducer,
    authentification: authentificationSlice.reducer,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);