const { Schema, model } = require('mongoose');

const jobSchema = new Schema({
  title: { type: String,  },
  company: String,
  location: String,
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