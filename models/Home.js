const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homeSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  typeOfHome: {
    type: String,
    required: true
  },
  sqft: {
    type: Number,
    required: true
  },
  floors: {
    type: Number,
    required: true
  },
  consType: {
    type: String,
    required: true
  },
  yardSize: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;
