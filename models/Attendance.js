const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { 
    type: Date, 
    default: Date.now()
  },
  records: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      status: { type: String, enum: ["Present", "Absent"], required: true }
    }
  ]
});

module.exports = mongoose.model("Attendance", attendanceSchema);
