const mongoose = require("mongoose");
const { registerUser } = require("../controllers/userControllers");

const connectDB = () => {
  try {
    return mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
