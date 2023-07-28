require('dotenv').config();
const { DB_NAME, DB_HOST, DB_USER, DB_PW } = process.env;
const { Pool } = require('pg');

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PW,
  port: 5432
});

(async() => {
  try {
    await pool.connect();
    console.log(`User "${ DB_USER }" connected to DB: ${ DB_NAME }`);

  } catch(err) {
    console.error(`Error connecting to DB: ${ err }`);
  }
})();

module.exports = pool;

/*
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PW,
{
  host: DB_HOST,
  dialect: 'postgres',
  define: { timestamps: false }
});

(async() => {
  try {
    // create tables (sync models)
    await sequelize.sync();
    console.log(`User "${ DB_USER }" connected to DB: ${ DB_NAME }`);

  } catch(err) {
    console.error(`Error connecting to DB: ${ err }`);
  }
})();

module.exports = sequelize;
*/