const express = require("express");
const router = express.Router();
const yup = require("yup");
const { Module } = require("../models");
const { validateToken, validateAdmin } = require("../middlewares/auth");
const { Op } = require("sequelize");

// Create a new module (admin only)
router.post("/create", validateToken, validateAdmin, async (req, res) => {
  try {
    const newModule = await Module.create(req.body);
    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk Create Modules
router.post("/bulk-create", validateToken, validateAdmin, async (req, res) => {
  const modules = req.body.modules;

  if (!Array.isArray(modules) || modules.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid input: Expected an array of modules" });
  }

  const moduleSchema = yup.object().shape({
    moduleCode: yup.string().trim().required("Module code is required"),
    title: yup.string().trim().required("Title is required"),
    description: yup.string().trim().required("Description is required"),
    school: yup.string().trim().required("School is required"),
    credit: yup.number().positive().integer().required("Credit is required"),
    domain: yup.string().trim().required("Domain is required"),
    levelOfStudy: yup.string().trim().required("Level of study is required"),
    prerequisite: yup.string().trim(),
    competencyLevel: yup
      .number()
      .positive()
      .integer()
      .required("Competency level is required"),
  });

  const results = {
    success: [],
    errors: [],
  };

  for (const moduleData of modules) {
    try {
      const validatedData = await moduleSchema.validate(moduleData, {
        abortEarly: false,
      });

      // Check if module already exists
      const existingModule = await Module.findOne({
        where: { moduleCode: validatedData.moduleCode },
      });

      if (existingModule) {
        results.errors.push({
          moduleCode: validatedData.moduleCode,
          error: "Module already exists",
        });
        continue;
      }

      // Create module
      const newModule = await Module.create(validatedData);
      results.success.push({
        moduleCode: newModule.moduleCode,
        id: newModule.id,
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        results.errors.push({
          moduleCode: moduleData.moduleCode,
          error: error.errors,
        });
      } else {
        results.errors.push({
          moduleCode: moduleData.moduleCode,
          error: error.message,
        });
      }
    }
  }

  res.json(results);
});

// Get all modules
// router.get('/', validateToken, async (req, res) => {
//   try {
//     const modules = await Module.findAll();
//     res.status(200).json(modules);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get all modules (alternative route)
router.get("/all", validateToken, async (req, res) => {
  try {
    const modules = await Module.findAll();
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific module
router.get("/:moduleCode", validateToken, async (req, res) => {
  try {
    const module = await Module.findOne({
      where: { moduleCode: req.params.moduleCode },
    });
    if (module) {
      res.status(200).json(module);
    } else {
      res.status(404).json({ message: "Module not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a module (admin only)
router.put("/:moduleCode", validateToken, validateAdmin, async (req, res) => {
  try {
    const [updated] = await Module.update(req.body, {
      where: { moduleCode: req.params.moduleCode },
    });
    if (updated) {
      const updatedModule = await Module.findOne({
        where: { moduleCode: req.params.moduleCode },
      });
      res.status(200).json(updatedModule);
    } else {
      res.status(404).json({ message: "Module not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a module (admin only)
router.delete(
  "/:moduleCode",
  validateToken,
  validateAdmin,
  async (req, res) => {
    try {
      const deleted = await Module.destroy({
        where: { moduleCode: req.params.moduleCode },
      });
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Module not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
