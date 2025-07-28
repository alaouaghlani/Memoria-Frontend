import { createSlice } from '@reduxjs/toolkit';

export const CloseAdultInitialState = {
  olderRequest: [],
};

export const closeAdultSlice = createSlice({
  name: 'closeAdult',
  initialState: CloseAdultInitialState,
  reducers: {
    setOlderRequest: (state, action) => {
      state.olderRequest = action.payload.olderRequest;
    },
  },
});

export const { setOlderRequest } = closeAdultSlice.actions;
