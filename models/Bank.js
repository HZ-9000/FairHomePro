const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  creditcard: {
    type: Number,
    required: true
  },
  exp: {
    type: String,
    required: true
  },
  cvv: {
    type: Number,
    required: true
  },
  zipcode: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Bank = mongoose.model('Bank', userSchema);

module.exports = Bank;
