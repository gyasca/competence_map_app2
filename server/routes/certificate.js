const express = require("express");
const router = express.Router();
const { Certificate, User, Module } = require("../models");
const { validateToken } = require("../middlewares/auth");
const yup = require("yup");

// Validation schema for certificate
const certificateSchema = yup.object().shape({
  moduleCode: yup.string().required("Module code is required"),
  title: yup.string().required("Certificate title is required"),
  filePath: yup.string().required("Certificate file path is required"),
});

// Create a new certificate
router.post("/create/:userId", validateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { moduleCode, title, filePath } = req.body;

    const newCertificate = {
      userId,
      moduleCode,
      title,
      filePath
    };

    await certificateSchema.validate(newCertificate, { abortEarly: false });
    const createdCertificate = await Certificate.create(newCertificate);
    res.status(201).json(createdCertificate);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get all certificates for the logged-in user
router.get("/user/:userId", validateToken, async (req, res) => {
  try {
    const certificates = await Certificate.findAll({
      where: { userId: req.params.userId },
      include: [
        {
          model: User,
          attributes: ["userId", "adminNumber", "email"],
        },
        {
          model: Module,
          attributes: ["moduleCode", "title", "description"],
        },
      ],
    });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a certificate by id
router.get("/:id", validateToken, async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        {
          model: User,
          attributes: ["userId", "email", "adminNumber"],
        },
        {
          model: Module,
          attributes: ["moduleCode", "title", "description"],
        },
      ],
    });
    if (certificate) {
      res.json(certificate);
    } else {
      res.status(404).json({ message: "Certificate not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a certificate (user only)
router.put("/:id", validateToken, async (req, res) => {
  try {
    await certificateSchema.validate(req.body, { abortEarly: false });
    const [updated] = await Certificate.update(req.body, {
      where: { id: req.params.id, userId: req.user.id },
    });
    if (updated) {
      const updatedCertificate = await Certificate.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });
      res.json(updatedCertificate);
    } else {
      res.status(404).json({
        message: "Certificate not found or you don't have permission to update it",
      });
    }
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete a certificate (user only)
router.delete("/:id", validateToken, async (req, res) => {
  try {
    const deleted = await Certificate.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({
        message: "Certificate not found or you don't have permission to delete it",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;