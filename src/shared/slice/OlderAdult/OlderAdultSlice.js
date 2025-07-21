import { createSlice } from '@reduxjs/toolkit';

export const OlderAdultInitialState = {
  loggedInUser: undefined,
  isLoggedIn: false,
  userId: undefined,
  token: undefined,
};

export const olderAdultSlice = createSlice({
  name: 'olderAdult',
  initialState: OlderAdultInitialState,
  reducers: {
 

  },
});

export const {} =
  olderAdultSlice.actions;
