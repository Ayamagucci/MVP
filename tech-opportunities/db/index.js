require('dotenv').config();
const { DB_NAME, DB_HOST, DB_USER, DB_PW } = process.env;
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