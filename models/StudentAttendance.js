const mongoose = require("mongoose");

const studentAttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  totalClasses: { 
    type: Number, 
    default: 0 
  },
  attendedClasses: {
   type: Number, 
   default: 0 
  }
});

module.exports = mongoose.model("StudentAttendance", studentAttendanceSchema);
