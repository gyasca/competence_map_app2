const express = require("express");
const router = express.Router();
const { CourseModule, Course, Module } = require("../models");
const { validateToken, validateAdmin } = require("../middlewares/auth");
const yup = require("yup");

// Validation schema for course module
const courseModuleSchema = yup.object().shape({
  courseCode: yup.string().required("Course code is required"),
  moduleCode: yup.string().required("Module code is required"),
  order: yup.number(),
  prevModuleCodes: yup.array().of(yup.string()),
  nextModuleCodes: yup.array().of(yup.string()),
});

// Create a new course module (admin only)
router.post(
  "/:courseCode/create",
  validateToken,
  validateAdmin,
  async (req, res) => {
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
  }
);

// Get all modules for a course
router.get("/course/:courseCode/modules", validateToken, async (req, res) => {
  try {
    const courseModules = await CourseModule.findAll({
      where: { courseCode: req.params.courseCode },
      include: [
        {
          model: Course,
          attributes: ["courseCode", "name", "description"],
        },
        {
          model: Module,
          attributes: ["moduleCode", "title", "credit", "description"],
        },
      ],
      order: [["order", "ASC"]],
    });
    res.json(courseModules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a course module by id
router.get("/course/module/:id", validateToken, async (req, res) => {
  try {
    const courseModule = await CourseModule.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          attributes: ["courseCode", "name", "description"],
        },
        {
          model: Module,
          attributes: ["moduleCode", "title", "credit", "description"],
        },
      ],
    });
    if (courseModule) {
      res.json(courseModule);
    } else {
      res.status(404).json({ message: "Course module not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a course module (admin only)
router.put(
  "/course/:courseCode/module/edit/:id",
  validateToken,
  validateAdmin,
  async (req, res) => {
    try {
      await courseModuleSchema.validate(req.body, { abortEarly: false });
      const [updated] = await CourseModule.update(req.body, {
        where: { id: req.params.id },
      });
      if (updated) {
        const updatedCourseModule = await CourseModule.findByPk(req.params.id);
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
  }
);

// Delete a course module (admin only)
router.delete(
  "/course/:courseCode/module/delete/:id",
  validateToken,
  validateAdmin,
  async (req, res) => {
    try {
      const deleted = await CourseModule.destroy({
        where: { id: req.params.id },
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Course module not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;