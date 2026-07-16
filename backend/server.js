const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/db');

// Load models to register schemas and trigger fallbacks
const User = require('./models/User');
const Center = require('./models/Center');
const PickupRequest = require('./models/PickupRequest');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pickups', require('./routes/pickups'));
app.use('/api/centers', require('./routes/centers'));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'E-Waste Collection API is running...', databaseMode: global.dbMode });
});

// Seed Database Function
async function seedDatabase() {
  try {
    // 1. Seed Centers
    const centers = await Center.find({});
    if (centers.length === 0) {
      console.log('Seeding collection centers...');
      const seedCenters = [
        {
          name: 'GreenTech Recycling Hub',
          address: 'Building 12, Tech Park Avenue, Kakkanad, Kochi',
          operatingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
          phone: '+91 98765 43210',
          coordinates: { lat: 10.0159, lng: 76.3419 }
        },
        {
          name: 'Eco-Cycle E-Waste Point',
          address: 'MG Road, Near Metro Station, Ernakulam',
          operatingHours: 'Mon - Fri: 10:00 AM - 7:00 PM',
          phone: '+91 98765 43211',
          coordinates: { lat: 9.9763, lng: 76.2798 }
        },
        {
          name: 'Global Electronic Waste Depot',
          address: 'Industrial Area, Phase II, Kalamassery',
          operatingHours: 'Mon - Sat: 8:00 AM - 5:00 PM',
          phone: '+91 98765 43212',
          coordinates: { lat: 10.0543, lng: 76.3218 }
        }
      ];

      for (const c of seedCenters) {
        await Center.create(c);
      }
      console.log('Collection centers seeded successfully.');
    }

    // 2. Seed Admin & Citizen Users
    const adminUser = await User.findOne({ email: 'admin@ewaste.com' });
    let adminId, citizenId;

    if (!adminUser) {
      console.log('Seeding admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      const newAdmin = await User.create({
        name: 'Eco Admin',
        email: 'admin@ewaste.com',
        password: hashedPassword,
        role: 'admin',
        ecoPoints: 0
      });
      adminId = newAdmin._id;
      console.log('Admin user seeded (admin@ewaste.com / admin123)');
    } else {
      adminId = adminUser._id;
    }

    const citizenUser = await User.findOne({ email: 'citizen@ewaste.com' });
    if (!citizenUser) {
      console.log('Seeding citizen user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('citizen123', salt);
      const newCitizen = await User.create({
        name: 'John Doe',
        email: 'citizen@ewaste.com',
        password: hashedPassword,
        role: 'citizen',
        ecoPoints: 120
      });
      citizenId = newCitizen._id;
      console.log('Citizen user seeded (citizen@ewaste.com / citizen123)');

      // Seed a few pickup requests for the citizen to show on dashboard immediately
      console.log('Seeding initial pickup requests...');
      await PickupRequest.create({
        user: citizenId,
        userName: 'John Doe',
        category: 'Mobile Phones',
        description: 'Old cracked smartphone and charger',
        weight: 1.5,
        address: 'House No. 45, Green Lane, Kochi',
        pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'pending',
        pointsAwarded: 0
      });

      await PickupRequest.create({
        user: citizenId,
        userName: 'John Doe',
        category: 'Computers',
        description: 'Broken desktop tower and keyboard',
        weight: 12.0,
        address: 'House No. 45, Green Lane, Kochi',
        pickupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        status: 'recycled',
        pointsAwarded: 120
      });
      console.log('Initial pickup requests seeded.');
    }
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  seedDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${global.dbMode} database mode.`);
    });
  });
});
