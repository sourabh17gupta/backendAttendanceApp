const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true, 
    unique: true 
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }, // Teacher assigned
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Class" 
  } // Class for subject
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);
