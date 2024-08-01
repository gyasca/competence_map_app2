const express = require("express");
const router = express.Router();
const { Course } = require("../models");
const { validateToken, validateAdmin } = require("../middlewares/auth");
const yup = require("yup");

// Validation schema for course
const courseSchema = yup.object().shape({
  courseCode: yup.string().trim().required("Course code is required"),
  name: yup.string().trim().required("Course name is required"),
  description: yup.string().trim().required("Description is required"),
});

// Create a new course (admin only)
router.post("/create", validateToken, validateAdmin, async (req, res) => {
  try {
    await courseSchema.validate(req.body, { abortEarly: false });
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get all courses
router.get("/all", validateToken, async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific course
router.get("/:courseCode", validateToken, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.courseCode);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a course (admin only)
router.put("/:courseCode", validateToken, validateAdmin, async (req, res) => {
  try {
    await courseSchema.validate(req.body, { abortEarly: false });
    const [updated] = await Course.update(req.body, {
      where: { id: req.params.courseCode },
    });
    if (updated) {
      const updatedCourse = await Course.findByPk(req.params.courseCode);
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete a course (admin only)
router.delete(
  "/:courseCode",
  validateToken,
  validateAdmin,
  async (req, res) => {
    try {
      const deleted = await Course.destroy({
        where: { id: req.params.courseCode },
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
