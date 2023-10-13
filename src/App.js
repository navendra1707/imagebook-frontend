import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import Login from "./pages/Auth/Login";
import CheckSession from "./components/CheckSession";
import Home from "./pages/Home/Home";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const isAuth = useSelector(state => state.user);

  const startServer = async () => {
    await fetch(`${process.env.REACT_APP_BASE_URL}/`);
  }

  useEffect(() => {
    startServer();
  }, [])

  return (
    <div>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
        <CheckSession />
          <Routes>
            <Route element={isAuth ? <Navigate to='/' /> : <Login />} path="/login" />
            <Route element={isAuth ? <Navigate to='/' /> : <Login />} path="/register" />
            <Route element={isAuth ? <Home /> : <Navigate to='/login' />} path="/" />
            </Routes>
        </ThemeProvider>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={mode === "dark" ? mode : "colored"}
      />
    </div>
  );
};

export default App;
