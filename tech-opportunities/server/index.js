require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const { PORT, API_ID, API_KEY } = process.env;
const app = express();

const db = require('../db/index');
const { searchJobs, saveJob, getSavedJobs, deleteSavedJob } = require('./controller/actions');

const path = require('path');
const morgan = require('morgan');

app.use(express.json());
app.use(cors());

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/jobs/search', searchJobs);
app.post('/api/jobs/save', saveJob);
app.get('/api/jobs/saved/:userId', getSavedJobs);
app.delete('/api/jobs/saved/:userId/:jobId', deleteSavedJob);

app.listen(PORT, () => {
  console.log(`Server listening at PORT: ${ PORT }`);
});