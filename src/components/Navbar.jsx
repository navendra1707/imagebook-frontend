import { useTheme } from "@emotion/react";
import { Card } from "@mui/material";
import React from "react";
import FlexBetween from "../styled/FlexBetween";
import Heading from "../styled/Heading";
import { useCookies } from "react-cookie";
import checkSession from "../utils/checkSession";
import Btn from "../styled/Btn";
import { LOGOUT_API } from "../endpoints";
import { toast } from "react-toastify";
import { setLogin } from "../state";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alt = palette.background.alt;

  const [cookies, setCookie] = useCookies(["user"]);
  const session = cookies.token;

  const isAuth = !checkSession(session, setCookie);

  const logout = async () => {
    dispatch(setLogin({
      user: null
    }));
    setCookie('token', null);
    navigate('/login');
  }

  return (
    <Card
      sx={{
        backgroundColor: alt,
        width: "100vw",
        p: "1rem 0",
        overflowX: "hidden",
      }}
      elevation={2}
    >
      <FlexBetween
        sx={{
          justifyContent: 'space-between',
          paddingX: '1rem'
        }}
      >
        <Heading color={"primary"}>ImageBook</Heading>
        {isAuth && <Btn onClick={logout}>Logout</Btn>}
      </FlexBetween>
    </Card>
  );
};

export default Navbar;
