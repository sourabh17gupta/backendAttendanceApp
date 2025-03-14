const User = require("../models/User.js");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt");


//login 

exports.Login = async(req,res)=>{

    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message:"please enter email or password",
            })
        }
        let response = await User.findOne({email:email});
        if(!response){
            return res.status(404).json({
                success: false,
                message:"user does not exist please sign up"
            })
        }
        
        //verify password & genrate a JW token
        const payload = {
            email: response.email,
            id:response._id,
            role:response.role,
            ID:response.ID
        }
        const isMatch =await bcrypt.compare(password,response.password);
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"please enter correct password"
            })
        }
        else{
            //password match
            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                }
            );
            response = response.toObject();
            response.token = token;
            response.password = undefined;
            const options = {
                expired:new Date(Date.now()+3*24*60*60*1000*1000*1000*60),
                httpOnly:true,
            }
            res.cookie("token",token, options).status(200).json({
                success:true,
                token,
                response,
                message:"logged in successfully"
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            error:err,
            message:"internal server error"
        })
    }
}
