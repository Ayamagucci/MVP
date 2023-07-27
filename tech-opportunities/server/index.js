require('dotenv').config();
const express = require('express');
const axios = require('axios');

const { PORT, API_ID, API_KEY } = process.env;
const app = express();

const db = require('../db/index');
const path = require('path');
const morgan = require('morgan');

app.use(express.json());
// app.use(cors());

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../dist')));

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

/*
app.get('/api/jobs', async(req, res) => {
  try {
    const { app_id, app_key, results_per_page, location, what } = req.query;

    const queryParams = new URLSearchParams({
      app_id: API_ID,
      app_key: API_KEY,
      results_per_page,
      location,
      what
    });

    // assign page to 1
    const API_URL = `http://api.adzuna.com/v1/api/jobs/us/search/1?${ queryParams.toString() }`;

    const jobResults = await axios.get(API_URL);

    const jobs = jobResults.data.results;
    console.log(`JOBS: ${ JSON.stringify(jobs) }`);

    res.status(200).json(jobs);

  } catch(err) {
    res.status(500).json({ error: `Error fetching jobs from API: ${ err.response.data }` });
  }
});
*/

app.listen(PORT, () => {
  console.log(`Server listening at PORT: ${ PORT }`);
});