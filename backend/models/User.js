const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
  ecoPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = mongoose.model('User', UserSchema);

const UserModel = {
  find: async (query) => {
    return global.dbMode === 'json' ? global.mocks.User.find(query) : MongoUser.find(query);
  },
  findOne: async (query) => {
    return global.dbMode === 'json' ? global.mocks.User.findOne(query) : MongoUser.findOne(query);
  },
  findById: async (id) => {
    return global.dbMode === 'json' ? global.mocks.User.findById(id) : MongoUser.findById(id);
  },
  create: async (doc) => {
    return global.dbMode === 'json' ? global.mocks.User.create(doc) : MongoUser.create(doc);
  },
  findByIdAndUpdate: async (id, update, options) => {
    return global.dbMode === 'json' ? global.mocks.User.findByIdAndUpdate(id, update, options) : MongoUser.findByIdAndUpdate(id, update, options);
  }
};

module.exports = UserModel;
