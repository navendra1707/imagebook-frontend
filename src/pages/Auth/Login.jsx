import React from "react";
import Layout from "../../components/Layout";
import { Box, Container, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useTheme } from "@emotion/react";
import Heading from "../../styled/Heading";
import { useLocation } from "react-router-dom";

const Login = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { palette } = useTheme();
  const location = useLocation();
  const alt = palette.background.alt;
  const main = palette.primary.main;

  const title = location.pathname === "/login" ? "Login" : "Sign Up";

  return (
    <Layout>
      <Container>
        <Heading style={{ textAlign: "center", color: main, margin: "1rem 0" }}>
          {title}
        </Heading>
        <Box
          width={isNonMobileScreens ? "50%" : "93%"}
          mt = "2rem"
          marginX={'auto'}
          p = "1rem 0"
          borderRadius={"1.5rem"}
          sx={{
            backgroundColor: alt
          }}
        >
          <Form />
        </Box>
      </Container>
    </Layout>
  );
};

export default Login;
