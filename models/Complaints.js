const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
  RecipiantEmail: {
    type: String,
    required: true
  },
  SenderEmail: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Complaint = mongoose.model('License', complaintSchema);

module.exports = Complaint;
