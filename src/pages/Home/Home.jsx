import React from "react";
import Layout from "../../components/Layout";
import CreatePost from "../../components/CreatePost";
import { Stack, useMediaQuery } from "@mui/material";
import Posts from "../../components/Posts";

const Home = () => {
  const isMobile = useMediaQuery("(max-width: 1000px)");

  return (
    <Layout>
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent={"space-between"}
        gap={2}
      >
        <CreatePost />
        <Posts />
      </Stack>
    </Layout>
  );
};

export default Home;
