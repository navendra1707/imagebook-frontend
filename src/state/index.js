import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  posts: []
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null; 
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    }
  },
});

export const { setMode, setLogin, setLogout, setPost, setPosts } = authSlice.actions;
export default authSlice.reducer;
