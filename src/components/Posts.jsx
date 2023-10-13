import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_POST_API } from "../endpoints";
import { toast } from "react-toastify";
import { setPosts } from "../state";
import Heading from "../styled/Heading";
import { useTheme } from "@emotion/react";
import {
  CircularProgress,
  Container,
  Stack,
  useMediaQuery,
} from "@mui/material";
import Post from "./Post";

const Posts = () => {
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { palette } = useTheme();
  const isMobile = useMediaQuery("(max-width: 1000px)");

  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/${GET_POST_API}/${user.id}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    setLoading(false);
    if (!response.ok) {
      toast.error(data.message);
      return;
    }
    dispatch(
      setPosts({
        posts: data.posts,
      })
    );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container
      sx={{
        width: isMobile ? "90vw" : "50vw",
        padding: "1rem",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : !loading && posts.length === 0 ? (
        <Heading style={{ color: palette.neutral.dark }}>
          No Posts Found
        </Heading>
      ) : (
        <Stack justifyContent={"center"} alignItems={"center"} gap={2}>
          <Heading
            color={palette.neutral.main}
          >
            Your Posts
          </Heading>
          {posts.map((post) => {
            return <Post post={post} />;
          })}
        </Stack>
      )}
    </Container>
  );
};

export default Posts;
