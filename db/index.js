require('dotenv').config();
const { PORT, HOST, USER, DB } = process.env;
const mongoose = require('mongoose');

(async() => {
  try{
    await mongoose.connect(`mongodb://${ HOST }:27017/${ DB }`);
    console.log(`Connected to MongoDB!`);
  } catch(err) {
    console.error(`Error connecting to DB: ${ DB }`);
  }
})();

module.exports = mongoose;