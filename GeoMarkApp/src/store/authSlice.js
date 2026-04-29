import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionLogin(state, action) {
      state.accessToken = action.payload;
    },
    sessionLogout(state) {
      state.accessToken = null;
    },
  },
});

export const { sessionLogin, sessionLogout } = authSlice.actions;
export default authSlice.reducer;
