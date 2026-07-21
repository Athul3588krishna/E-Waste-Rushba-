const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ewaste_secret_key_123';

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'citizen',
      ecoPoints: 0
    });

    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, ecoPoints: user.ecoPoints } });
      }
    );
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, ecoPoints: user.ecoPoints } });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Delete password before returning
    const userCopy = { ...user };
    delete userCopy.password;
    res.json(userCopy);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/redeem
// @desc    Redeem points for user
// @access  Private
router.post('/redeem', auth, async (req, res) => {
  const { points } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if ((user.ecoPoints || 0) < points) {
      return res.status(400).json({ msg: 'Insufficient points balance' });
    }

    user.ecoPoints = (user.ecoPoints || 0) - points;
    await user.save();

    const userCopy = { ...user };
    delete userCopy.password;
    res.json(userCopy);
  } catch (err) {
    console.error('Redeem points error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
