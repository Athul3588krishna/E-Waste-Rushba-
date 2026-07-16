const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-memory/JSON-file database mock helper
function readJsonFile(filename) {
  const filepath = path.join(dataDir, filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify([], null, 2));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeJsonFile(filename, data) {
  const filepath = path.join(dataDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

class MockModel {
  constructor(filename) {
    this.filename = filename;
  }
  
  async find(query = {}) {
    let data = readJsonFile(this.filename);
    return data.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    }).map(item => ({ ...item, save: async () => this.saveItem(item) }));
  }

  async findOne(query = {}) {
    let data = readJsonFile(this.filename);
    const item = data.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (!item) return null;
    return { ...item, save: async () => this.saveItem(item) };
  }

  async findById(id) {
    let data = readJsonFile(this.filename);
    const item = data.find(item => item._id === id);
    if (!item) return null;
    return { ...item, save: async () => this.saveItem(item) };
  }

  async create(doc) {
    let data = readJsonFile(this.filename);
    const newDoc = { _id: Math.random().toString(36).substr(2, 9), ...doc, createdAt: new Date() };
    data.push(newDoc);
    writeJsonFile(this.filename, data);
    return { ...newDoc, save: async () => this.saveItem(newDoc) };
  }

  async findByIdAndUpdate(id, update, options = {}) {
    let data = readJsonFile(this.filename);
    let index = data.findIndex(item => item._id === id);
    if (index === -1) return null;
    
    // Support MongoDB style updates ($inc, $push, etc., if basic, or just merge)
    let updatedDoc = { ...data[index], ...update };
    data[index] = updatedDoc;
    writeJsonFile(this.filename, data);
    return { ...updatedDoc, save: async () => this.saveItem(updatedDoc) };
  }

  async saveItem(item) {
    let data = readJsonFile(this.filename);
    let index = data.findIndex(d => d._id === item._id);
    if (index === -1) {
      data.push(item);
    } else {
      data[index] = item;
    }
    writeJsonFile(this.filename, data);
    return item;
  }
}

global.dbMode = 'mongodb';
global.mocks = {
  User: new MockModel('users.json'),
  PickupRequest: new MockModel('pickups.json'),
  Center: new MockModel('centers.json')
};

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ewaste_collection';
  try {
    console.log('Connecting to MongoDB at:', mongoURI);
    // Use short timeout so we fallback quickly if MongoDB is not running
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log('MongoDB Connected successfully!');
    global.dbMode = 'mongodb';
  } catch (err) {
    console.error('MongoDB connection failed. Switching to JSON File-based database fallback.');
    console.log('Ensure MongoDB is installed and running locally to use real MongoDB.');
    global.dbMode = 'json';
  }
};

module.exports = { connectDB };
