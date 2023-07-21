require('dotenv').config();
const { PORT } = process.env;
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const db = require('../db/models.js');

const app = express();

app.use(morgan('dev'));

app.use(
  express.static(path.join(__dirname, '../dist/components'))
);

app.listen(PORT, () => {
  console.log(`Server listening at PORT: ${ PORT }`);
});