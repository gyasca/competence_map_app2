const express = require('express');
const router = express.Router();
const { StudentModuleEnrollment, User } = require('../models');
const { validateToken, validateAdmin } = require('../middlewares/auth');

// Enroll a student in a module (admin only)
router.post('/create', validateToken, validateAdmin, async (req, res) => {
  try {
    const newEnrollment = await StudentModuleEnrollment.create(req.body);
    res.status(201).json(newEnrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all enrollments for a student
router.get('/student/:adminNumber', validateToken, async (req, res) => {
  try {
    const enrollments = await StudentModuleEnrollment.findAll({
      where: { adminNumber: req.params.adminNumber }
    });
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students enrolled in a module (admin only)
router.get('/module/:moduleCode', validateToken, validateAdmin, async (req, res) => {
  try {
    const enrollments = await StudentModuleEnrollment.findAll({
      where: { moduleCode: req.params.moduleCode },
      include: [{ model: User, attributes: ['name', 'email'] }]
    });
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a student's grade for a module (admin only)
router.put('/:adminNumber/:moduleCode', validateToken, validateAdmin, async (req, res) => {
  try {
    const [updated] = await StudentModuleEnrollment.update(
      { grade: req.body.grade },
      { 
        where: { 
          adminNumber: req.params.adminNumber,
          moduleCode: req.params.moduleCode
        } 
      }
    );
    if (updated) {
      const updatedEnrollment = await StudentModuleEnrollment.findOne({
        where: { 
          adminNumber: req.params.adminNumber,
          moduleCode: req.params.moduleCode
        }
      });
      res.status(200).json(updatedEnrollment);
    } else {
      res.status(404).json({ message: 'Enrollment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a student from a module (admin only)
router.delete('/:adminNumber/:moduleCode', validateToken, validateAdmin, async (req, res) => {
  try {
    const deleted = await StudentModuleEnrollment.destroy({
      where: { 
        adminNumber: req.params.adminNumber,
        moduleCode: req.params.moduleCode
      }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Enrollment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;