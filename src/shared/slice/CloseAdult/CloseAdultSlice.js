import { createSlice } from '@reduxjs/toolkit';

export const CloseAdultInitialState = {
  olderRequest: [],
  deceasedRequest: [],
};

export const closeAdultSlice = createSlice({
  name: 'closeAdult',
  initialState: CloseAdultInitialState,
  reducers: {
    setOlderRequest: (state, action) => {
      state.olderRequest = action.payload.olderRequest;
    },
    setDeceasedRequest: (state, action) => {
      state.deceasedRequest = action.payload.deceasedRequest;
    },
  },
});

export const { setOlderRequest,setDeceasedRequest } = closeAdultSlice.actions;
