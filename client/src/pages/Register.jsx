import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../main";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      userId: "",
      email: "",
      password: "",
      name: "",
      role: "student",
      profilePictureFilePath: "",
      adminNumber: "",
      course: "",
      yearOfStudy: 1,
      staffId: "",
      department: "",
      position: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .trim()
        .min(1, "Name must be at least 1 character")
        .max(50, "Name must be at most 50 characters")
        .required("Name is required")
        .matches(
          /^[a-zA-Z '-,.]+$/,
          "Only allow letters, spaces and characters: ' - , ."
        ),
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
          "At least 1 letter and 1 number"
        ),
      confirmPassword: yup
        .string()
        .trim()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
      role: yup.string().required("Role is required"),
      adminNumber: yup.string().when("role", {
        is: "student",
        then: yup.string().required("Admin number is required for students"),
      }),
      course: yup.string().when("role", {
        is: "student",
        then: yup.string().required("Course is required for students"),
      }),
      yearOfStudy: yup.number().when("role", {
        is: "student",
        then: yup
          .number()
          .required("Year of study is required for students")
          .min(1, "Year of study must be at least 1")
          .max(5, "Year of study must be at most 5"),
      }),
      staffId: yup.string().when("role", {
        is: "staff",
        then: yup.string().required("Staff ID is required for staff"),
      }),
      department: yup.string().when("role", {
        is: "staff",
        then: yup.string().required("Department is required for staff"),
      }),
      position: yup.string().when("role", {
        is: "staff",
        then: yup.string().required("Position is required for staff"),
      }),
    }),
    onSubmit: (data) => {
      const userData = {
        userId: data.role === "student" ? data.adminNumber : data.staffId,
        email: data.email.trim().toLowerCase(),
        password: data.password,
        name: data.name,
        role: data.role,
        profilePictureFilePath: data.profilePictureFilePath || "default.jpg",
        adminNumber: data.role === "student" ? data.adminNumber : null,
        course: data.role === "student" ? data.course : null,
        yearOfStudy: data.role === "student" ? data.yearOfStudy : null,
        staffId: data.role === "staff" ? data.staffId : null,
        department: data.role === "staff" ? data.department : null,
        position: data.role === "staff" ? data.position : null,
      };

      http
        .post("/user/register", userData)
        .then((res) => {
          console.log(res.data);
          toast.success("Registration successful. Please log in.");
          navigate("/login");
        })
        .catch((err) => {
          toast.error(`Registration failed: ${err.response?.data?.message || "Unknown error"}`);
        });
    },
  });

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);

    const userData = {
      userId: decoded.sub,
      email: decoded.email,
      password: "googlesecretpasswordxx94n2a", // You might want to generate a random password here
      name: decoded.name,
      role: "student", // Default role for Google sign-ups
      profilePictureFilePath: decoded.picture,
      adminNumber: decoded.sub, // Using Google's sub as a placeholder
      course: "Not specified",
      yearOfStudy: 1,
    };

    http
      .get(`/user/email/${decoded.email}`)
      .then((res) => {
        console.log("User already exists:", res.data);
        loginUser(decoded.email);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        http
          .post("/user/register", userData)
          .then((res) => {
            console.log("New user registered:", res.data);
            loginUser(decoded.email);
          })
          .catch((err) => {
            toast.error(`Registration failed: ${err.response?.data?.message || "Unknown error"}`);
          });
      });
  };

  const loginUser = (email) => {
    const loginRequest = {
      email: email,
      password: "googlesecretpasswordxx94n2a",
    };
    http
      .post("/user/login", loginRequest)
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        setUser(res.data.user);
        navigate("/");
      })
      .catch((err) => {
        toast.error(`Login failed: ${err.response?.data?.message || "Unknown error"}`);
      });
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" sx={{ my: 2 }}>
        Register
      </Typography>
      <Box
        sx={{
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log("Login Failed");
            toast.error("Google login failed");
          }}
        />
        <Typography variant="body2" sx={{ my: 2 }}>
          OR
        </Typography>
      </Box>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        <TextField
          fullWidth
          margin="dense"
          select
          label="Role"
          name="role"
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.role && Boolean(formik.errors.role)}
          helperText={formik.touched.role && formik.errors.role}
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="staff">Staff</MenuItem>
        </TextField>
        {formik.values.role === "student" && (
          <>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Admin Number"
              name="adminNumber"
              value={formik.values.adminNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.adminNumber && Boolean(formik.errors.adminNumber)}
              helperText={formik.touched.adminNumber && formik.errors.adminNumber}
            />
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Course"
              name="course"
              value={formik.values.course}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.course && Boolean(formik.errors.course)}
              helperText={formik.touched.course && formik.errors.course}
            />
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Year of Study"
              name="yearOfStudy"
              type="number"
              value={formik.values.yearOfStudy}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.yearOfStudy && Boolean(formik.errors.yearOfStudy)}
              helperText={formik.touched.yearOfStudy && formik.errors.yearOfStudy}
            />
          </>
        )}
        {formik.values.role === "staff" && (
          <>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Staff ID"
              name="staffId"
              value={formik.values.staffId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.staffId && Boolean(formik.errors.staffId)}
              helperText={formik.touched.staffId && formik.errors.staffId}
            />
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Department"
              name="department"
              value={formik.values.department}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.department && Boolean(formik.errors.department)}
              helperText={formik.touched.department && formik.errors.department}
            />
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Position"
              name="position"
              value={formik.values.position}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.position && Boolean(formik.errors.position)}
              helperText={formik.touched.position && formik.errors.position}
            />
          </>
        )}
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Register
        </Button>
      </Box>
      <Divider sx={{ width: "100%", mt: 2, mb: 2 }} />
      <Typography variant="body2">
        Already have an account?{" "}
        <Button href="/login" variant="body2" sx={{ color: "orangered" }}>
          Login
        </Button>
      </Typography>
      <ToastContainer />
    </Box>
  );
}

export default Register;