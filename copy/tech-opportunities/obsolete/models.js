const { Schema, model } = require('mongoose');

const jobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: String,
  app_process: String
});

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  location: String,
  education: { type: String, default: 'High School' }
});

const Job = model('Job', jobSchema);

// module.exports = Job;