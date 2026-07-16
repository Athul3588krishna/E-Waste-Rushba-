const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PickupRequest = require('../models/PickupRequest');
const User = require('../models/User');

// @route   POST api/pickups
// @desc    Create a pickup request
// @access  Private
router.post('/', auth, async (req, res) => {
  const { category, description, weight, address, pickupDate } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const newRequest = await PickupRequest.create({
      user: req.user.id,
      userName: user.name,
      category,
      description,
      weight: Number(weight),
      address,
      pickupDate,
      status: 'pending',
      pointsAwarded: 0
    });

    res.json(newRequest);
  } catch (err) {
    console.error('Create pickup error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/pickups
// @desc    Get all pickup requests (Admin gets all, Citizen gets own)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'admin') {
      requests = await PickupRequest.find({});
    } else {
      requests = await PickupRequest.find({ user: req.user.id });
    }
    // Sort by newest first
    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(requests);
  } catch (err) {
    console.error('Get pickups error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/pickups/:id/status
// @desc    Update request status (Admin only)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Authorization denied. Admin role required.' });
  }

  const { status } = req.body;

  try {
    let pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ msg: 'Pickup request not found' });
    }

    const oldStatus = pickup.status;
    pickup.status = status;

    // If changing to 'recycled' and not already awarded points
    if (status === 'recycled' && oldStatus !== 'recycled' && pickup.pointsAwarded === 0) {
      const points = Math.round(pickup.weight * 10); // 10 points per kg
      pickup.pointsAwarded = points;

      // Award points to the user
      const user = await User.findById(pickup.user);
      if (user) {
        user.ecoPoints = (user.ecoPoints || 0) + points;
        await user.save();
      }
    }

    await pickup.save();
    res.json(pickup);
  } catch (err) {
    console.error('Update pickup status error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
