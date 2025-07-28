import { createSlice } from '@reduxjs/toolkit';

export const OlderAdultInitialState = {
  closeList: [],
};

export const olderAdultSlice = createSlice({
  name: 'olderAdult',
  initialState: OlderAdultInitialState,
  reducers: {
    setCloseList: (state, action) => {
      state.closeList = action.payload.closeList;
    },
  },
});

export const { setCloseList } = olderAdultSlice.actions;
