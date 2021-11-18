const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const licenseSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  LicenseName: {
    type: String,
    required: true
  }
}, { timestamps: true });

const License = mongoose.model('License', licenseSchema);

module.exports = License;
