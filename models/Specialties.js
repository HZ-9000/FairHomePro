const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const specialtieSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  SpecialtieName: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Specialtie = mongoose.model('Specialtie', specialtieSchema);

module.exports = Specialtie;
