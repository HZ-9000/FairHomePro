const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  creditcard: {
    type: String,
    required: true
  },
  exp: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    required: true
  },
  pin: {
    type: String
  }
}, { timestamps: true });

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
