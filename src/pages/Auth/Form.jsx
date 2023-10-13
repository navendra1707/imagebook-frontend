import { useState } from "react";
import {useCookies} from "react-cookie";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  LinearProgress,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { REGISTER_API, LOGIN_API } from "../../endpoints";
import { setLogin } from "../../state";

// register schema for yup and formik
const registerSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup.string().required("Password is required"),
  picture: yup.string().required("Picture is required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cookies, setCookie] = useCookies(['user']);
  const location = useLocation();
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  const register = async (values, onSubmitProps) => {
    setIsLoading(true);
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedUserResponse = await fetch(
      `${process.env.REACT_APP_BASE_URL}/${REGISTER_API}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const savedUser = await savedUserResponse.json();

    if (savedUserResponse.ok) {
      toast.success("Account created successfully.");
    } else {
      toast.error(savedUser.message);
      return;
    }
    onSubmitProps.resetForm();

    if (savedUser) {
      navigate('/login');
    }
    setIsLoading(false);
  };

  const login = async (values, onSubmitProps) => {
    setIsLoading(true);
    const loginResponse = await fetch(
      `${process.env.REACT_APP_BASE_URL}/${LOGIN_API}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(values), 
      }
    );

    const loggedIn = await loginResponse.json();
    onSubmitProps.resetForm();

    if (loginResponse.status === 200) {
      toast.success("Logged In Successfully.");
    } else {
      toast.error(loggedIn.message);
    }

    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
        })
      );
      setCookie('token', loggedIn.token);
      console.log(loggedIn.token)
      navigate("/");
    }
    setIsLoading(false);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              disabled={isLoading}
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            {isLoading && <LinearProgress sx={{ m: "1rem 0" }} />}
            <Typography
              onClick={() => {
                navigate(isLogin ? '/register' : '/login')
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.dark,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
