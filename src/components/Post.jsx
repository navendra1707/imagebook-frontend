import { useTheme } from "@emotion/react";
import {
  Box,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import moment from "moment";
import Btn from "../styled/Btn";
import { Close, Delete } from "@mui/icons-material";
import { INCREASE_VIEW_API, DELETE_POST } from "../endpoints";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import checkSession from "../utils/checkSession";
import FlexBetween from "../styled/FlexBetween";

const Post = ({ post }) => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [views, setViews] = useState(post.views);
  const [loading, setLoading] = useState(false);

  const defaultBack = palette.background.default;
  const main = palette.neutral.main;
  const [cookies, setCookie] = useCookies(["user"]);

  if (checkSession(cookies.token, setCookie)) {
    navigate(0);
  }

  const deletePost = async () => {
    setLoading(true);
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${DELETE_POST}/${post._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${cookies.token}` },
    });

    setLoading(false);
    if(response.ok){
        toast.success('Post Deleted');
        navigate(0);
    }else{
        toast.error('Some error occured');
    }
    setIsOpen(false);
  }

  const increaseView = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/${INCREASE_VIEW_API}/${post._id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${cookies.token}` },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }
    setViews(data.post.views);
  };

  return (
    <>
      <Card
        sx={{
          padding: "1rem",
          borderRadius: "1rem",
          backgroundColor: defaultBack,
          maxWidth: isMobile ? "85vw" : "45vw",
        }}
        elevation={4}
      >
        <Stack justifyContent={"center"} gap={0.5}>
          <Typography color={main} sx={{ mt: "1rem", fontWeight: "bold" }}>
            {post ? post.title : ""}
          </Typography>
          <Typography color={main} sx={{ mt: "1rem" }}>
            {post ? post.description : ""}
          </Typography>
          <Typography
            color={palette.neutral.medium}
            sx={{ fontSize: "0.7rem" }}
          >
            {moment
              .utc(post ? post.createdAt : "")
              .local()
              .startOf("seconds")
              .fromNow()}
          </Typography>
          <img
            width={isMobile ? "280rem" : "350rem"}
            height={isMobile ? "280rem" : "350rem"}
            style={{
              marginTop: "1rem",
              borderRadius: "0.5rem",
              objectFit: "cover",
            }}
            src={post ? post.picturePath : ""}
            className="blurred"
          />
          <Stack
            direction="row"
            alignItems={"center"}
            gap={2}
            justifyContent={"space-between"}
          >
            <Typography
              color={main}
              sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              {`Views: ${views}`}
            </Typography>
            <Btn
              onClick={() => {
                setOpen(true);
                increaseView();
              }}
            >
              View Post
            </Btn>
            <Btn
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <Delete />
            </Btn>
          </Stack>
        </Stack>
      </Card>
      <Dialog fullWidth open={open}>
        <DialogActions>
          <Btn
            onClick={() => {
              setOpen(false);
            }}
          >
            <Close />
          </Btn>
        </DialogActions>
        <Card
          sx={{
            padding: "1rem",
            borderRadius: "1rem",
            backgroundColor: defaultBack,
            maxWidth: isMobile ? "85vw" : "45vw",
            overflowY: "scroll",
          }}
          elevation={4}
        >
          <Stack
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={0.5}
            direction={isMobile ? "column" : "row"}
          >
            <img
              width={isMobile ? "90%" : "50%"}
              height={"auto"}
              style={{
                marginTop: "1rem",
                borderRadius: "0.5rem",
                objectFit: "cover",
              }}
              src={post ? post.picturePath : ""}
            />
            <Stack
              justifyContent={isMobile ? "center" : "space-evenly"}
              gap={isMobile ? 0.5 : 2}
            >
              <Typography
                color={main}
                sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
              >
                {post ? post.title : ""}
              </Typography>
              <Typography color={main} sx={{ fontSize: "1.2rem" }}>
                {post ? post.description : ""}
              </Typography>
              <Typography
                color={palette.neutral.medium}
                sx={{ fontSize: "1rem" }}
              >
                {moment
                  .utc(post ? post.createdAt : "")
                  .local()
                  .startOf("seconds")
                  .fromNow()}
              </Typography>
              <Typography
                color={main}
                sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
              >
                {`Views: ${views}`}
              </Typography>
            </Stack>
          </Stack>
        </Card>
      </Dialog>
      <Dialog
        fullWidth
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <DialogTitle id="alert-delete-title">Delete Post?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Click on Confirm to delete your post.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => {
              deletePost();
            }}
            disabled={loading}
          >
            <FlexBetween>
              <Delete />

              <Typography>{loading ? <CircularProgress /> : 'CONFIRM'}</Typography>
            </FlexBetween>
          </IconButton>
          <IconButton
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <FlexBetween>
              <Typography>CANCEL</Typography>
            </FlexBetween>
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Post;
