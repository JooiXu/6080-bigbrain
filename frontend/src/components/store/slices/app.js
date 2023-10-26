import { createSlice } from '@reduxjs/toolkit';

let savedSession = localStorage.getItem('session');
savedSession = savedSession
  ? JSON.parse(savedSession)
  : {
      token: null,
      email: null,
    };

const appSlice = createSlice({
  name: 'app',
  initialState: {
    admin: savedSession,
  },
  reducers: {
    setAdmin (state, action) {
      state.admin = action.payload;
      localStorage.setItem('session', JSON.stringify(state.admin));
    },
  }
});

export const actions = appSlice.actions;
export default appSlice.reducer;
