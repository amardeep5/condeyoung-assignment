const mongoose = require("mongoose");
require("dotenv").config();
const DB_URI = process.env.MONGOURI;
function connect() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res, err) => {
        if (err) return reject(err);
        console.log("running");
        resolve();
      });
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
