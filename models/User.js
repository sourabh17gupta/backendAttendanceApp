const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
  type: String, 
  required: true
 },
 ID:{
  type:String,
  required:true,
  unique:true
 },
  email: { 
    type: String, 
    required: true,
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ["admin", "teacher", "student"],
    required: true 
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", default: null }, // Only for students
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // Only for teachers
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
