const Class = require("../models/Class");
const Subject = require("../models/Subject");
const User = require("../models/User");
const mongoose = require("mongoose");
const Announcement = require("../models/Announcement");
const Attendance = require("../models/Attendance");
const StudentAttendance = require("../models/StudentAttendance");

//create a class

exports.CreateClass = async(req,res)=>{
    try{
        const {name} = req.body;
        const existingClass = await Class.findOne({ name });
        if(existingClass) {
        return res.status(400).json({ error: "Class with this name already exists" });
       }
        const cls =  new Class({
                name
        });

        const response = await Class.create(cls);
        res.status(200).json({
            success:true,
            message:"class create successfully",
        })
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"internal server error",
        })
    }
}

//get all classes

exports.getClass = async(req,res)=>{
    try{
       const response = await Class.find().select("name");
       if(!response){
        res.status(500).json({
            success:true,
            res:response,
            message:"NO classe found"
           })
       }
       res.status(200).json({
        success:true,
        res:response,
        message:"fetch all classes"
       })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
}

//add student to a class
exports.addStudent = async(req,res)=>{
    try {
        const {ID} = req.body;
        const {classId} = req.params;
        // Check if student exists and is actually a student
        const student = await User.findOne({ID:ID});
        if (!student || student.role !== "student") {
          return res.status(404).json({ error: "Student not found or not a valid student" });
        }
    
        // Check if the student is already enrolled in another class
        if (student.class) {
          return res.status(400).json({ error: "Student is already enrolled in a class" });
        }
    
        // Check if class exists
        const classData = await Class.findById(classId);
        if (!classData) {
          return res.status(404).json({ error: "Class not found" });
        }
    
        // Add student to the class
        classData.students.push(student._id);
        await classData.save();
    
        // Update the student's class reference
        student.class = classId;
        await student.save();
    
        res.status(200).json({ 
            message: "Student added successfully", 
            class: classData,
            student:student 
        });
      } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}

//remove student from a class

exports.removeStudent = async (req, res) => {
    try {
      const { ID } = req.body;
      const {classId} = req.params;
      const student = await User.findOne({ID:ID});
      const studentId = student._id
      // Validate classId & studentId
      if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(studentId)) {
          return res.status(400).json({ error: "Invalid Class ID or Student ID" });
        }
        
      // Find class
      const classData = await Class.findById(classId);
      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }
  
      // Check if student is in the class
      if (!classData.students.includes(studentId)) {
        return res.status(400).json({ error: "Student is not enrolled in this class" });
      }
  
      // Remove student from the class
      classData.students = classData.students.filter(
        (id) => id.toString() !== studentId.toString()
      );
      //remove class from student
      if (student.class && student.class.toString() === classId.toString()) {
        student.class = null; // Or set it to null
        await student.save();
      }
      // Save the updated class
      await classData.save();
  
      res.status(200).json({ 
        message: "Student removed successfully", 
        classData,
        student 
    });
    }
    catch (error) {
      console.error("Error removing student:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


//remove student from a class

exports.removeStudent1 = async (req, res) => {
    try {
      const {classId} = req.params;
      const {studentId} = req.params;
      const student = await User.findOne({_id:studentId});
      // Validate classId & studentId
      if (!mongoose.Types.ObjectId.isValid(classId) || !mongoose.Types.ObjectId.isValid(studentId)) {
          return res.status(400).json({ error: "Invalid Class ID or Student ID" });
        }
        
      // Find class
      const classData = await Class.findById(classId);
      if (!classData) {
        return res.status(404).json({ error: "Class not found" });
      }
  
      // Check if student is in the class
      if (!classData.students.includes(studentId)) {
        return res.status(400).json({ error: "Student is not enrolled in this class" });
      }
  
      // Remove student from the class
      classData.students = classData.students.filter(
        (id) => id.toString() !== studentId.toString()
      );
      //remove class from student
      if (student.class && student.class.toString() === classId.toString()) {
        student.class = null; // Or set it to null
        await student.save();
      }
      // Save the updated class
      await classData.save();
  
      res.status(200).json({ 
        message: "Student removed successfully", 
        classData,
        student 
    });
    }
    catch (error) {
      console.error("Error removing student:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  //fetch all student in class
  exports.getStudent = async(req,res)=>{
    try{
      const {classId} = req.params;

      //check is class exist
      const cls = await Class.findOne({_id:classId});
      if(!cls){
        return res.status(404).json({
            success:false,
            message:"class not found",
        })
      }

      const response =await Class.findOne({_id:classId}).populate("students","name ID",).exec();
      res.status(200).json({
        success:true,
        students:response.students,
        message:"fetch all student in a class",
      })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"internal server error",
          })
    }
  }


  //create subject assign teacher and add to class
  exports.createSubject = async(req,res)=>{
    try{
       const {subjectName,teacherId} = req.body;
       const {classId} = req.params;
       //check valid teacher
       const teacher = await User.findOne({ID:teacherId});
       if(!teacher){
           return res.status(404).json({
               success:false,
               message:"teacher not exist"
            })
        }
        //check valid class
        const cls = await Class.findOne({_id:classId});
        if(!cls){
            return res.status(404).json({
                success:false,
                message:"class not found"
            })
        }
        
        const sub = new Subject({
          name:subjectName,
          teacher: teacher._id,
          class: cls._id
        })

       const subject = await Subject.create(sub);

       //update teacher subject array
       await User.findByIdAndUpdate(teacher,{$push:{subjects:subject._id}},{new:true});

       //update class subject array
       await Class.findByIdAndUpdate(cls,{$push:{subjects:subject._id}},{new:true});

       res.status(200).json({
         success:true,
         message:"subject created successfully and teacher is assigned",
         subject
       })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
  }

//fetch all subject of a class

exports.getSubject = async(req,res)=>{
    try{
       const {classId} = req.params;

       //check valid class
       const cls = await Class.findOne({_id:classId});
       if(!cls){
        return res.status(404).json({
            success:false,
            message:"class not found"
        })
       } 

       const subject = await Class.findOne({ _id: classId })
      .populate({
          path: "subjects",
          select: "name teacher -_id", // Exclude subject _id
          populate: {
            path: "teacher",
            select: "name -_id", // Exclude teacher _id
          },
        })
  .exec();

       res.status(200).json({
        success:true,
        subject:subject.subjects,
        message:"subject fetch successfully"
       })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
}

//get all subject of teacher that would assign to him
exports.getSubjectsForTeacher = async (req, res) => {
  try {
      const { teacherId } = req.params;

      // Validate if the teacher exists
      const teacher = await User.findById(teacherId);
      if (!teacher) {
          return res.status(404).json({
              success: false,
              message: "Teacher not found",
          });
      }

      // Fetch subjects taught by the teacher and populate class details
      const subjects = await Subject.find({ teacher: teacherId })
      .populate("class","name")
      .select("class name")

      res.status(200).json({
          success: true,
          subjects,
          message: "Subjects fetched successfully",
      });

  } catch (err) {
      console.error(err);
      res.status(500).json({
          success: false,
          message: "Internal server error",
      });
  }
};

//make a announcement by teacher

exports.createAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;
    const {teacherId,subjectId} = req.params; // Extracted from token

    const sub = await Subject.findById(subjectId).populate("teacher");
    if (!sub) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    // Ensure only the assigned teacher can post
    if (sub.teacher._id.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const announcement = new Announcement({
      subject: subjectId,
      teacher: new mongoose.Types.ObjectId(teacherId), // Ensure it's an ObjectId
      message,
    });

    await announcement.save();

    res.status(201).json({ success: true,
       message: "Announcement created successfully",
       announcement
       });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//student fetch announcement
exports.getAnnouncement = async(req,res)=>{
  try{
    const {studentId} = req.params;
    const student = await User.findOne({_id:studentId});
    if(!student){
      return res.status(404).json({
        success:false,
        message:"student not found"
      })
    }
    const cls = await Class.findById(student.class._id).populate("subjects");
    if(!cls){
      return res.status(404).json({
        success:false,
        message:"class not found"
      })
    }


    const subjectIds = cls.subjects.map(subject => subject._id);//find all subject id that are in class and map

    const announcements = await Announcement.find({ subject: { $in: subjectIds } })
      .populate("subject", "name -_id") .select("message date -_id").sort({date:-1})

    res.status(200).json({
      success:true,
      announcements,
      message:"announcement fetch successfully"
    })

  }
  catch(err){
    console.error(err);
    res.status(500).json({
      success: false, 
      message: "Internal Server Error"
    });
  }
}

//api to take attendence by teacher

exports.takeAttendance = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { records } = req.body;
    const {teacherId} = req.params;

    // Validate subject and teacher
    const subject = await Subject.findById(subjectId).populate("teacher");
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }
    if (subject.teacher._id.toString()!==teacherId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Save attendance
    const attendance = new Attendance({ subject: subjectId, teacher: teacherId, records });
    await attendance.save();

    // Update student attendance stats
    for (const record of records) {
      let studentAttendance = await StudentAttendance.findOne({ student: record.student, subject: subjectId });

      if (!studentAttendance) {
        studentAttendance = new StudentAttendance({
          student: record.student,
          subject: subjectId,
          totalClasses: 0,
          attendedClasses: 0
        });
      }

      studentAttendance.totalClasses += 1;
      if (record.status === "Present") {
        studentAttendance.attendedClasses += 1;
      }

      await studentAttendance.save();
    }

    res.status(201).json({ success: true, message: "Attendance recorded successfully", attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


//fetch subject for student with percentage attended class

exports.getStudentSubjectsWithAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await User.findOne({_id:studentId});
    const cls = student.class._id
    // Find all subjects where the student is enrolled
    const subjects = await Subject.find({class:cls});

    if (!subjects.length) {
      return res.status(404).json({ success: false, message: "No subjects found for the student." });
    }
    console.log(subjects);
    let subjectAttendance = [];

    for (let subject of subjects) {
      const studentSub = await StudentAttendance.findOne({ subject: subject._id , student:studentId });
      if(studentSub){
        const totalClass = studentSub.totalClasses;
        const attendedClass = studentSub.attendedClasses;
  
        const attendancePercentage = totalClass === 0 ? -1 : ((attendedClass / totalClass) * 100).toFixed(2);
  
        subjectAttendance.push({
          subjectId: subject._id,
          subjectName: subject.name,
          totalClass,
          attendedClass,
          attendancePercentage: `${attendancePercentage}%`
        });
      }
      else{
        subjectAttendance.push({
          subjectId: subject._id,
          subjectName: subject.name,
          totalClass: 0,
          attendedClass: 0,
          attendancePercentage: "not started"
        });
      }
      
    }

    res.status(200).json({ success: true, subjects: subjectAttendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//fetch all student corresponding to a subject with their ID

exports.getAllStudentForAttendance = async(req,res)=>{
  try{
    const {subjectId} = req.params;
    const sub = await Subject.findOne({_id:subjectId});
    const cls = sub.class;
    const response = await Class.findOne({_id:cls}).populate("students","name ID").select("stident");
    res.status(200).json({
      success:true,
      response,
      message:"student fetch"
    })

  }
  catch(err){
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}