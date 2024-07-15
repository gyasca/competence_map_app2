const express = require('express');
const router = express.Router();
const { Module } = require('../models');
const { validateToken, validateAdmin } = require('../middlewares/auth');

// Create a new module (admin only)
router.post('/create', validateToken, validateAdmin, async (req, res) => {
  try {
    const newModule = await Module.create(req.body);
    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all modules
router.get('/', validateToken, async (req, res) => {
  try {
    const modules = await Module.findAll();
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific module
router.get('/:moduleCode', validateToken, async (req, res) => {
  try {
    const module = await Module.findOne({
      where: { moduleCode: req.params.moduleCode }
    });
    if (module) {
      res.status(200).json(module);
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a module (admin only)
router.put('/:moduleCode', validateToken, validateAdmin, async (req, res) => {
  try {
    const [updated] = await Module.update(req.body, {
      where: { moduleCode: req.params.moduleCode }
    });
    if (updated) {
      const updatedModule = await Module.findOne({ where: { moduleCode: req.params.moduleCode } });
      res.status(200).json(updatedModule);
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a module (admin only)
router.delete('/:moduleCode', validateToken, validateAdmin, async (req, res) => {
  try {
    const deleted = await Module.destroy({
      where: { moduleCode: req.params.moduleCode }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;