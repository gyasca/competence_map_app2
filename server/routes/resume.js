const express = require('express');
const router = express.Router();
const { Resume, User } = require('../models');
const { validateToken } = require('../middlewares/auth');

// Create a new resume
router.post('/', validateToken, async (req, res) => {
  try {
    const { certificateIds, pdfDetails } = req.body;
    const newResume = await Resume.create({
      adminNumber: req.user.adminNumber,
      certificateIds,
      pdfDetails
    });
    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all resumes for a user
router.get('/', validateToken, async (req, res) => {
  try {
    const resumes = await Resume.findAll({
      where: { adminNumber: req.user.adminNumber }
    });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific resume
router.get('/:id', validateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, adminNumber: req.user.adminNumber }
    });
    if (resume) {
      res.status(200).json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a resume
router.put('/:id', validateToken, async (req, res) => {
  try {
    const { certificateIds, pdfDetails } = req.body;
    const [updated] = await Resume.update(
      { certificateIds, pdfDetails, lastModifiedDate: new Date() },
      { where: { id: req.params.id, adminNumber: req.user.adminNumber } }
    );
    if (updated) {
      const updatedResume = await Resume.findOne({ where: { id: req.params.id } });
      res.status(200).json(updatedResume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a resume
router.delete('/:id', validateToken, async (req, res) => {
  try {
    const deleted = await Resume.destroy({
      where: { id: req.params.id, adminNumber: req.user.adminNumber }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;