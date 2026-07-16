const mongoose = require('mongoose');

const PickupRequestSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Store User ID
  userName: { type: String, required: true }, // Denormalized for display convenience
  category: { type: String, required: true }, // e.g. 'Computers', 'Mobile Phones', 'Batteries', etc.
  description: { type: String },
  weight: { type: Number, required: true }, // in kg
  address: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'scheduled', 'collected', 'recycled'], default: 'pending' },
  pointsAwarded: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MongoPickupRequest = mongoose.model('PickupRequest', PickupRequestSchema);

const PickupRequestModel = {
  find: async (query) => {
    return global.dbMode === 'json' ? global.mocks.PickupRequest.find(query) : MongoPickupRequest.find(query);
  },
  findOne: async (query) => {
    return global.dbMode === 'json' ? global.mocks.PickupRequest.findOne(query) : MongoPickupRequest.findOne(query);
  },
  findById: async (id) => {
    return global.dbMode === 'json' ? global.mocks.PickupRequest.findById(id) : MongoPickupRequest.findById(id);
  },
  create: async (doc) => {
    return global.dbMode === 'json' ? global.mocks.PickupRequest.create(doc) : MongoPickupRequest.create(doc);
  },
  findByIdAndUpdate: async (id, update, options) => {
    return global.dbMode === 'json' ? global.mocks.PickupRequest.findByIdAndUpdate(id, update, options) : MongoPickupRequest.findByIdAndUpdate(id, update, options);
  }
};

module.exports = PickupRequestModel;
