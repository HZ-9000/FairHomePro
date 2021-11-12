const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const buisnessSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  serviceTypes: {
    type: Array,
    required: true
  },
  specialties: {
    type: Array,
    required: true
  },
  licenses: {
    type: Array,
    required: true
  },
  serviceAreas: {
    type: Array,
    required: true
  }
}, { timestamps: true });

const Buisness = mongoose.model('Buisness', buisnessSchema);

module.exports = Buisness;
