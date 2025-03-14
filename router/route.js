const express = require("express");
const router = express();


const {Signup} = require("../controllers/Signup");
const {Login} = require("../controllers/Login");
const {auth,isTeacher,isAdmin} = require("../middlewares/auth");
const {CreateClass,getClass,addStudent,removeStudent,getStudent,createSubject,getSubject,getSubjectsForTeacher
    ,createAnnouncement,getAnnouncement,takeAttendance,getStudentSubjectsWithAttendance,getAllStudentForAttendance,removeStudent1} = require("../controllers/Class");

router.post("/signup",Signup);
router.post("/login",Login);
router.post("/createclass",auth,isAdmin,CreateClass);
router.get("/getclass",auth,getClass);
router.post("/addstudent/:classId",auth,isAdmin,addStudent);
router.post("/removestudent/:classId",auth,isAdmin,removeStudent);
router.post("/removeStudent1/:classId/:studentId",auth,isAdmin,removeStudent1);
router.get("/getstudent/:classId",auth,getStudent);
router.post("/createsubject/:classId",auth,isAdmin,createSubject);
router.get("/getsubject/:classId",auth,getSubject);
router.get("/getSubjectsForTeacher/:teacherId",auth,getSubjectsForTeacher);
router.get("/getAnnouncement/:studentId",auth,getAnnouncement);
router.post("/createAnnouncement/:teacherId/:subjectId",auth,isTeacher,createAnnouncement);
router.post("/takeAttendance/:subjectId/:teacherId",auth,isTeacher,takeAttendance);
router.get("/getStudentSubjectsWithAttendance/:studentId",auth,getStudentSubjectsWithAttendance);
router.get("/getAllStudentForAttendance/:subjectId",auth,getAllStudentForAttendance);


module.exports = router;