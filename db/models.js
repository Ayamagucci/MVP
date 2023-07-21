const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  body: { type: String, default: null },
  password: { type: String, required: true },
  age: { type: Number, default: null },
  followers: { type: Number, default: 0 },
  location: { type: String, default: null },
  hiddenProps: { type: [ String ], default: [] }
});

const User = mongoose.model('User', userSchema);

module.exports = User;