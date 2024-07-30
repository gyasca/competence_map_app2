const express = require("express");
const router = express.Router();
const { CourseModule } = require("../models");
const { validateToken, validateAdmin } = require("../middlewares/auth");
const yup = require("yup");

// Validation schema for course module
const courseModuleSchema = yup.object().shape({
  courseId: yup.number().required("Course ID is required"),
  moduleId: yup.number().required("Module ID is required"),
  order: yup.number().required("Order is required"),
});

// Create a new course module (admin only)
router.post("/create", validateToken, validateAdmin, async (req, res) => {
  try {
    await courseModuleSchema.validate(req.body, { abortEarly: false });
    const newCourseModule = await CourseModule.create(req.body);
    res.status(201).json(newCourseModule);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get all modules for a course
router.get("/course/:courseId", validateToken, async (req, res) => {
  try {
    const courseModules = await CourseModule.findAll({
      where: { courseId: req.params.courseId },
      order: [['order', 'ASC']]
    });
    res.json(courseModules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a course module (admin only)
router.put("/:courseModuleId", validateToken, validateAdmin, async (req, res) => {
  try {
    await courseModuleSchema.validate(req.body, { abortEarly: false });
    const [updated] = await CourseModule.update(req.body, {
      where: { id: req.params.courseModuleId }
    });
    if (updated) {
      const updatedCourseModule = await CourseModule.findByPk(req.params.courseModuleId);
      res.json(updatedCourseModule);
    } else {
      res.status(404).json({ message: "Course module not found" });
    }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete a course module (admin only)
router.delete("/:courseModuleId", validateToken, validateAdmin, async (req, res) => {
  try {
    const deleted = await CourseModule.destroy({
      where: { id: req.params.courseModuleId }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Course module not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;