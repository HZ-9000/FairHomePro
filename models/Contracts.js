const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  EmailBuisness: {
    type: String,
    required: true
  },
  EmailHome: {
    type: String,
    required: true
  },
  TypeOfService: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Contract = mongoose.model('Cotnract', contractSchema);

module.exports = Contract;
