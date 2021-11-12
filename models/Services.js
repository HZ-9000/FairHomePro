const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const servicesSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  pricePerUnit: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Services = mongoose.model('Services', servicesSchema);

module.exports = Services;
