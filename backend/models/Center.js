const mongoose = require('mongoose');

const CenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  operatingHours: { type: String, required: true },
  phone: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  }
});

const MongoCenter = mongoose.model('Center', CenterSchema);

const CenterModel = {
  find: async (query) => {
    return global.dbMode === 'json' ? global.mocks.Center.find(query) : MongoCenter.find(query);
  },
  findOne: async (query) => {
    return global.dbMode === 'json' ? global.mocks.Center.findOne(query) : MongoCenter.findOne(query);
  },
  findById: async (id) => {
    return global.dbMode === 'json' ? global.mocks.Center.findById(id) : MongoCenter.findById(id);
  },
  create: async (doc) => {
    return global.dbMode === 'json' ? global.mocks.Center.create(doc) : MongoCenter.create(doc);
  },
  findByIdAndUpdate: async (id, update, options) => {
    return global.dbMode === 'json' ? global.mocks.Center.findByIdAndUpdate(id, update, options) : MongoCenter.findByIdAndUpdate(id, update, options);
  }
};

module.exports = CenterModel;
