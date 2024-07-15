const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const yup = require("yup");
const { sign } = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();
const { validateToken, validateAdmin } = require("../middlewares/auth");

// Create General User (Register) /// just a template
router.post("/register", async (req, res) => {
  let data = req.body;

  // Validate request body
  let validationSchema = yup.object({
    adminNumber: yup.string().trim().required(),
    role: yup.string().trim().required(),
    email: yup.string().trim().email().required(),
    password: yup.string().trim().min(8).required(),
    name: yup
      .string()
      .trim()
      .matches(/^[a-z ,.'-]+$/i)
      .required(),
    profilePictureFilePath: yup.string().trim().required(),
  });

  try {
    await validationSchema.validate(data, { abortEarly: false });
  } catch (err) {
    res.status(400).json({ errors: err.errors });
    return;
  }

  // Trim string values
  data.adminNumber = data.adminNumber.trim();
  data.role = data.role.trim();
  data.email = data.email.trim().toLowerCase();
  data.password = data.password.trim();
  data.name = data.name.trim();
  data.profilePictureFilePath = data.profilePictureFilePath.trim();

  // Check admin number
  let user = await User.findOne({
    where: { adminNumber: data.adminNumber },
  });
  if (user) {
    res.status(400).json({ message: "Admin number already exists." });
    return;
  }

  // Check email
  user = await User.findOne({
    where: { email: data.email },
  });
  if (user) {
    res.status(400).json({ message: "Email already exists." });
    return;
  }

  // Hash password
  data.password = await bcrypt.hash(data.password, 10);

  // Create user
  let result = await User.create(data);
  res.json(result);
});

router.post("/studentregister", async (req, res) => {
  try {
    // Validation schema for student registration
    const validationSchema = yup.object().shape({
      adminNumber: yup.string().trim().required("Admin number is required"),
      email: yup.string().trim().email().required("Email is required"),
      password: yup.string().trim().min(8).required("Password is required"),
      name: yup.string().trim().required("Name is required"),
      role: yup.string().trim().required("Role is required"),
      profilePictureFilePath: yup.string().trim(),
      course: yup.string().trim().required("Course is required"),
      yearJoined: yup.number().required("Year joined is required"),
    });

    // Validate request body
    await validationSchema.validate(req.body, { abortEarly: false });

    // Check if email already exists
    const existingEmail = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if admin number already exists
    const existingAdminNumber = await User.findOne({
      where: { adminNumber: req.body.adminNumber },
    });
    if (existingAdminNumber) {
      return res.status(400).json({ message: "Admin number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      userId: req.body.adminNumber,
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      role: "student",
      profilePictureFilePath: req.body.profilePictureFilePath || "default.jpg",
      adminNumber: req.body.adminNumber,
      course: req.body.course,
      yearJoined: req.body.yearJoined,
    });

    res.status(201).json({
      message: "Student created successfully",
      user: newUser,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({
        message: "Error creating student",
        error: error.message,
      });
    }
  }
});

router.post("/staffregister", async (req, res) => {
  try {
    // Validation schema for staff registration
    const validationSchema = yup.object().shape({
      staffId: yup.string().trim().required("Staff ID is required"),
      email: yup.string().trim().email().required("Email is required"),
      password: yup.string().trim().min(8).required("Password is required"),
      name: yup.string().trim().required("Name is required"),
      role: yup.string().trim().required("Role is required"),
      profilePictureFilePath: yup.string().trim(),
      department: yup.string().trim().required("Department is required"),
      position: yup.string().trim().required("Position is required"),
    });

    // Validate request body
    await validationSchema.validate(req.body, { abortEarly: false });

    // Check if email already exists
    const existingEmail = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if staff ID already exists
    const existingStaffId = await User.findOne({
      where: { staffId: req.body.staffId },
    });
    if (existingStaffId) {
      return res.status(400).json({ message: "Staff ID already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = await User.create({
      userId: req.body.staffId,
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      role: "staff",
      profilePictureFilePath: req.body.profilePictureFilePath || "default.jpg",
      staffId: req.body.staffId,
      department: req.body.department,
      position: req.body.position,
    });

    res.status(201).json({
      message: "Staff created successfully",
      user: newUser,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ message: error.errors });
    } else {
      res.status(500).json({
        message: "Error creating staff",
        error: error.message,
      });
    }
  }
});

// Auth User (Login)
router.post("/login", async (req, res) => {
  let data = req.body;
  // Trim string values
  data.email = data.email.trim().toLowerCase();
  data.password = data.password.trim();
  // Check email and password
  let errorMsg = "Email or password is not correct.";
  let user = await User.findOne({
    where: { email: data.email },
  });
  if (!user) {
    res.status(404).json({ message: errorMsg });
    return;
  }
  let match = await bcrypt.compare(data.password, user.password);
  if (!match) {
    res.status(401).json({ message: errorMsg });
    return;
  }
  // Return user info
  let userInfo = {
    adminNumber: user.adminNumber,
    email: user.email,
    name: user.name,
  };
  // Create json web token based on user info raw json data
  let accessToken = sign(userInfo, process.env.APP_SECRET);
  res.json({
    accessToken: accessToken,
    user: userInfo,
  });
});

router.post("/googlelogin", async (req, res) => {
  const { token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email } = payload;

    // Check if user exists
    let user = await User.findOne({
      where: { email: email },
      attributes: { 
        exclude: ['password', 'adminNumber', 'course', 'yearJoined'] 
      }
    });

    if (!user) {
      return res.status(404).json({ 
        message: "User not found. Please register first.",
        errorCode: "USER_NOT_FOUND"
      });
    }

    if (user.role !== 'staff') {
      return res.status(403).json({ 
        message: "Google login is only available for staff accounts.",
        errorCode: "STAFF_ONLY"
      });
    }

    // Create JWT token
    const accessToken = sign(
      {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.APP_SECRET
    );

    // Log successful login
    console.log(`Successful Google login: ${user.email} at ${new Date().toISOString()}`);

    // Prepare user object for response
    const userResponse = user.get({ plain: true });

    res.json({
      accessToken: accessToken,
      user: userResponse
    });
  } catch (error) {
    console.error("Error in Google login:", error);
    res.status(401).json({ 
      message: "Invalid Google token",
      errorCode: "INVALID_TOKEN"
    });
  }
});

// Authenticate user credentials
router.get("/auth", validateToken, (req, res) => {
  let userInfo = {
    adminNumber: req.user.adminNumber,
    email: req.user.email,
    name: req.user.name,
  };
  res.json({
    user: userInfo,
  });
});

// Get authenticated user's information
router.get("/:id", validateToken, (req, res) => {
  let userInfo = {
    adminNumber: req.user.adminNumber,
    role: req.user.role,
    email: req.user.email,
    name: req.user.name,
    profilePictureFilePath: req.user.profilePictureFilePath,
  };
  res.json({
    user: userInfo,
  });
});

// Get authenticated user's information
router.get("/all", validateToken, validateAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
