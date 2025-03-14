const User = require("../models/User");
//auth middleware

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res,next)=>{
   try{
      //extract jwt token
      // console.log("body",req.body.token);
      // console.log("cookie",req.cookies.token);
      // console.log("header",req.header("Authorization"));
      const token = req.cookies.token ||req.headers.authorization?.split(" ")[1];;
      if(!token){
        return res.status(401).json({
            success:false,
            message:"token not available"
        })
      }
      //verify token
      try {
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        console.log(payload);
        req.user = payload;
      } catch (error) {
        return res.status(401).json({
            success:false,
            message:"token is invalid"
        })
      }


      next();
   }
   catch(err){
    return res.status(401).json({
        success:false,
        message:"internal server error in auth"
    })
   }
}

exports.isStudent = (req,res,next)=>{
  try{
     if(req.user.role!=="student"){
        return res.status(401).json({
            success:false,
            message:"this is protected route for student"
        })
     }

     next();
  }
  catch(err){
    return res.status(500).json({
        success:false,
        message:"internal server error for student"
    })
  }
}

exports.isAdmin = (req,res,next)=>{
    try{
       if(req.user.role!=="admin"){
          return res.status(401).json({
              success:false,
              message:"this is protected route for admin"
          })
       }
  
       next();
    }
    catch(err){
      return res.status(500).json({
          success:false,
          message:"internal server error for admin"
      })
    }
  }

exports.isTeacher = async(req,res,next)=>{
    try{
      
      if(req.user.role!=="teacher"){
        return res.status(401).json({
          success:false,
          message:"this is protected route for teacher"
        })
      }
    //   const {teacherId} = req.params;
    //   const teacher = await User.findOne({_id:teacherId});
    //   console.log(req.user.ID,teacher.ID);
    //   if (req.user.ID.toString() !== teacher.ID.toString()) {
    //     return res.status(401).json({
    //         success: false,
    //         message: "You are not an authorized teacher",
    //     });
    // }
  
       next();
    }
    catch(err){
      console.log(err);
      return res.status(500).json({
          success:false,
          message:"internal server error for teacher"
      })
    }
  }