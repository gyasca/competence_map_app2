const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple Route
app.get("/", (req, res) => {
  res.send("Test backend working");
});

// Routes
// CRUD modules
const moduleRoute = require('./routes/module');
app.use("/module", moduleRoute);

// CRUD users
const userRoute = require('./routes/user');
app.use("/user", userRoute);

// CRUD resume
const resumeRoute = require('./routes/resume');
app.use("/resume", resumeRoute);

// CRUD student module enrollment
const enrollmentRoute = require('./routes/enrollment');
app.use("/enrollment", enrollmentRoute);

// CRUD course
const courseRoute = require('./routes/course');
app.use("/course", courseRoute);

// CRUD courseModule
const courseModuleRoute = require('./routes/courseModule');
app.use("/courseModule", courseModuleRoute);

// CRUD certification
const certificateRoute = require('./routes/certificate');
app.use("/certificate", certificateRoute);

const db = require("./models");
db.sequelize.sync({ alter: true }).then(() => {
  let port = process.env.APP_PORT;
  app.listen(port, () => {
    console.log(`⚡ Sever running on http://localhost:${port}`);
  });
});
