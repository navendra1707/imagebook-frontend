import React from "react";
import Navbar from "./Navbar";
import { useTheme } from "@emotion/react";

const Layout = ({ children }) => {
  const {palette} = useTheme();

  return (
    <div
      style={{
        backgroundColor: palette.background.alt,
        minHeight: '100vh'
      }}
    >
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
