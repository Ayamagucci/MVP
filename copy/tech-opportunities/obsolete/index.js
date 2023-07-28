require('dotenv').config();
const { DB_PORT, DB_NAME } = process.env;
const mongoose = require('mongoose');

(async() => {
  try {
    await mongoose.connect(`mongodb://localhost:${ DB_PORT }/${ DB_NAME }`);
    console.log(`Connected to DB: ${ DB_NAME }`);

  } catch(err) {
    console.error(`Error connecting to DB: ${ err }`);
  }
})();

// export connection
exports = mongoose.connection;