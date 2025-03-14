const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  message: { 
    type: String, 
    required: true 
  },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  date: { type: Date, default: Date.now()}
}, { timestamps: true });

module.exports = mongoose.model("Announcement", announcementSchema);
