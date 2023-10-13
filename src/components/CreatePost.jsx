import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import FlexBetween from "../styled/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "./UserImage";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Typography,
  LinearProgress,
  Container,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { CREATE_POST_API } from "../endpoints";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Heading from "../styled/Heading";

const CreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { palette } = useTheme();
  const { id } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const [cookies] = useCookies(["user"]);
  const token = cookies.token;
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const medium = palette.neutral.medium;

  const name = user.firstName + " " + user.lastName;
  console.log(post);

  const handlePost = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("userId", id);
    formData.append("description", post.description);
    formData.append("title", post.title);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/${CREATE_POST_API}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );
    const data = await response.json();

    setImage(null);
    setPost("");
    setIsLoading(false);

    if (response.ok) {
      navigate(0);
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <Container
      sx={{
        width: isMobile ? "90vw" : "40vw",
        padding: '1rem'
      }}
    >
      <FlexBetween gap={"1.5rem"} sx={{ flexDirection: "column" }}>
        <Heading style={{ color: [palette.neutral.dark] }}>
          Create a Post
        </Heading>
        <InputBase
          placeholder="Title"
          onChange={(event) => {
            setPost((prev) => ({
              ...prev,
              title: event.target.value,
            }));
          }}
          value={post.title}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "0.5rem",
            padding: "1rem 2rem",
          }}
        />
        <InputBase
          placeholder="Description"
          onChange={(event) => {
            setPost((prev) => ({
              ...prev,
              description: event.target.value,
            }));
          }}
          value={post.description}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "0.5rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      <Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
        <Dropzone
          acceptedFiles=".jpg,.jpeg,.png"
          multiple={false}
          onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
        >
          {({ getRootProps, getInputProps }) => (
            <FlexBetween>
              <Box
                {...getRootProps()}
                border={`2px dashed ${palette.primary.main}`}
                p="1rem"
                width={"100%"}
                sx={{ "&:hover": { cursor: "pointer" } }}
              >
                <input {...getInputProps()} />
                {!image ? (
                  <p style={{ color: palette.neutral.dark }}>Add Image Here</p>
                ) : (
                  <FlexBetween>
                    <Typography style={{ color: palette.neutral.dark }}>
                      {image.name}
                    </Typography>
                    <EditOutlined />
                  </FlexBetween>
                )}
              </Box>
              {image && (
                <IconButton
                  onClick={() => setImage(null)}
                  sx={{ width: "15%" }}
                >
                  <DeleteOutlined />
                </IconButton>
              )}
            </FlexBetween>
          )}
        </Dropzone>
      </Box>

      <Divider sx={{ margin: "1.2rem 0" }} />

      <FlexBetween mb={isLoading ? 1 : 0}>
        <Button
          disabled={!post || isLoading}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            "&:disabled": {
              backgroundColor: palette.neutral.light,
            },
          }}
        >
          POST
        </Button>
      </FlexBetween>
      {isLoading && <LinearProgress />}
    </Container>
  );
};

export default CreatePost;
