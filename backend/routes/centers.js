const express = require('express');
const router = express.Router();
const Center = require('../models/Center');

// @route   GET api/centers
// @desc    Get all collection centers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const centers = await Center.find({});
    res.json(centers);
  } catch (err) {
    console.error('Get centers error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/centers
// @desc    Create a collection center (Admin only)
// @access  Private (in practice, but let's keep it simple for now)
router.post('/', async (req, res) => {
  const { name, address, operatingHours, phone, coordinates } = req.body;
  try {
    const center = await Center.create({
      name,
      address,
      operatingHours,
      phone,
      coordinates
    });
    res.json(center);
  } catch (err) {
    console.error('Create center error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
