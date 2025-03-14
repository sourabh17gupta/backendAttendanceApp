const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of students
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }] // List of subjects
}, { timestamps: true });

module.exports = mongoose.model("Class", classSchema);
