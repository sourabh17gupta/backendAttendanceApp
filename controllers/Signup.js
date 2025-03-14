const User = require("../models/User.js");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt");


exports.Signup = async(req,res)=>{
    try{
    const {name,email,password,role,ID} = req.body;
    if(!name||!email||!password||!role||!ID){
        return res.status(400).json({
            success:false,
            message:"please fill all information",
        })
    }
    const response = await User.findOne({email:email});
    const response1 = await User.findOne({ID:ID});
    if(response||response1){
        return res.status(402).json({
            success:false,
            message:`${role} alredy exist`,
        })
    }

         //secure password
         let hashedPassword;
         try{
           hashedPassword = await bcrypt.hash(password,10);
         }
         catch(err){
          res.status(500).json({
              success:false,
              message:"error in hashing password",
          })
         }


    const Admin = await User.findOne({role:"admin"});
    if(Admin && role==="admin"){
        return res.status(403).json({
            success:false,
            message:`${role} alredy exist`,
        })
    }
    const resp = await User.create({name:name,email:email,password:hashedPassword,role:role,ID:ID});
    res.status(200).json({
        success:true,
        res:resp,
        message:`${role} created successfully`,
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