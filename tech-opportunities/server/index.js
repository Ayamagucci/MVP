require('dotenv').config();
const axios = require('axios');
const { PORT, API_ID, API_KEY } = process.env;
const db = require('../db/index');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

/*
app.get('/jobs', async(req, res) => {
  try {
    const { app_id, app_key, results_per_page, location, what } = req.query;

    const queryParams = new URLSearchParams({
      app_id: API_ID,
      app_key: API_KEY,
      'content-type': 'application/json',
      results_per_page, location, what,
    });

    // assign page to 1
    const API_URL = `http://api.adzuna.com/v1/api/jobs/us/search/1?${ queryParams.toString() }`;

    // const jobResults = await axios.get(API_URL, { params: queryParams });
    const jobResults = await axios({
      method: 'get',
      baseURL: API_URL,
      params: queryParams
    });
    const jobs = jobResults.data.results;

    console.log(`JOBS: ${ JSON.stringify(jobs) }`);

    res.status(200).json(jobs);

  } catch(err) {
    console.error(`Error fetching jobs from API: ${ err.response.data }`);
    res.status(500).json({ error: `Error fetching jobs from API` });
  }
});
*/

app.listen(PORT, () => {
  console.log(`Server listening at PORT: ${ PORT }`);
});