import { Dialog } from "@mui/material";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import FlexBetween from "../styled/FlexBetween";
import Heading from "../styled/Heading";
import { useTheme } from "@emotion/react";
import Btn from "../styled/Btn";
import { useNavigate } from "react-router-dom";
import checkSession from "../utils/checkSession";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../state";

const CheckSession = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const session = cookies.token;

  const isExpired = checkSession(session, setCookie) && user;
  const [open, setOpen] = useState(isExpired);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const alt = palette.background.alt;
  const main = palette.primary.main;

  return (
    <div>
      <Dialog open={open}>
        <FlexBetween
          sx={{
            p: "1rem",
            backgroundColor: alt,
            minHeight: "15vh",
          }}
          gap={2}
          flexDirection={"column"}
        >
          <Heading style={{ color: main }}>Your Session has expired</Heading>
          <Btn
            onClick={() => {
              dispatch(setLogin({
                user: null
              }))
              navigate("/login");
              setOpen(false);
            }}
          >
            Login Again
          </Btn>
        </FlexBetween>
      </Dialog>
    </div>
  );
};

export default CheckSession;
