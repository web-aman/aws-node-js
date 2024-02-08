const md5 = require('md5')
const jwt = require("jsonwebtoken");
const humanize = require('string-humanize')
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const {twilio} = require('../functions/twilio')
const {sendMail} = require('../functions/mailer')

//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
  
    // if there is error then return Error
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      errors: errors.errors[0],
    });
  }
  
  const { phone, password, confirmPassword } = req.body;
  
  if(password != confirmPassword){
    res.status(400).send({
      status: 400,
      message: "Password and confirm password must be same"
    });
  }
  
  const user = await User.create({
    phone:(phone.replace(/[- )(]/g,'')).trim(),
    password: md5(password),
    OTP: String(Math.floor(100000 + Math.random() * 900000))
  });
  
  if (user) {
    const sendData = await twilio(user)
    if(sendData.type == 'success'){
      return res.status(201).send({status :201, data: user, message: "User created successfully" });
    } 
    return res.status(400).send({status :400, message: "Invalid data" });
  } 
    return res.status(400).send({status :400 , message:"User data is not valid"}); 
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" })
  }
};

const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
  
    // if there is error then return Error
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      errors: errors.errors[0],
    });
  }

const userData = await User.findOne({_id : req.params.id , isDeleted:false}).lean(true);

if(!userData){
  return res.status(400).send({status :400 , message:"User data not found"}); 
}
    if(userData?.OTP === req.body.otp){
      const user = await User.updateOne({_id:req.params.id, isDeleted:false},{
          $unset: {
            "OTP": ""
          }, 
          $set: {
            "isEmailVerified": true
          }
      });

      if(user?.modifiedCount){
        return res.status(201).send({status :201, message: "OTP verified successfully" });
      }
    } 
      return res.status(201).send({status :400, message: "Invalid OTP" });
    
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" })
  }
};

const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    // if there is error then return Error
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      errors: errors.errors[0],
    });
  }


const [userData, isEmail] = await Promise.all([
  User.findOne({_id : req.params.id , isDeleted:false}).lean(true),
  User.countDocuments({_id : req.params.id , isDeleted:false , isEmailVerified: true})
]);


if(!userData){
  return res.status(400).send({status :400 , message:"User data not found"}); 
}

if(!isEmail){
  return res.status(400).send({status :400 , message:"Email is not verified please verified first"})
}

const obj = {
  firstName : humanize((req.body.firstName).trim()),
  lastName : humanize((req.body.lastName).trim()),
  dob : req.body.dob,
  email: (req.body.email).toLowerCase()
}

 if(req.file && req?.file?.filename){
  obj['profileImage'] = `/image/${req.file.filename}`
 }
      const user = await User.updateOne({_id:req.params.id, isDeleted:false},{$set: obj});
      if(user?.modifiedCount){
        return res.status(201).send({status :201, message: "User Profile updated successfully" });
      }
      return res.status(400).send({status :400, message: "User Profile not updated" })
    
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" })
  }
};

const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
  
    // if there is error then return Error
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      errors: errors.errors[0],
    });
  }
      const otp =  String(Math.floor(1000 + Math.random() * 9000))
      const user = await User.updateOne({email:req.body.email},{$set: {OTP:otp}});
      if(user?.modifiedCount){
        sendMail({email: req.body.email , otp})
        return res.status(201).send({status :201, email : req.body.email , message: "Reset password OTP sent successfully" });
      }
      return res.status(400).send({status :400, message: "Invalid OTP" })
    
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" })
  }
};

const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
  
    // if there is error then return Error
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      errors: errors.errors[0],
    });
  }
  const userData = await User.findOne({email:req.params.email, isDeleted:false}).lean();
      if (!userData){
        return res.status(400).send({status :400, message: "User not found" })
      }

      if(userData?.OTP === req.body.otp){
        const token = uuidv4()
        const user = await User.updateOne({email:req.params.email},{ $unset: { "OTP": "" },  $set: { "token": token }});
        if(user?.modifiedCount){
          return res.status(201).send({status :201, token : token , message: "Reset password OTP sent successfully" });
        }
      }
      return res.status(400).send({status :400, message: "Invalid OTP" })
    
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" })
  }
};

const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    // if there is error then return Error
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      errors: errors.errors[0],
    });
  }
      const userData = await User.findOne({token:req.params.token, isDeleted:false}).lean();
      if (!userData){
        return res.status(400).send({status :400, message: "User not found" })
      }
      const {newPassword, confirmPassword} = req.body

      if(newPassword != confirmPassword){
        return res.status(400).send({status :400, message: "New Password and Confirm password must be same" })
      }


      const user = await User.updateOne({token:req.params.token},{$unset: { token: "" }, $set: { password: md5(newPassword) } });
      if(user?.modifiedCount){
        return res.status(201).send({status :201, message: "Password reset successfully" });
      }
      return res.status(400).send({status :400, message: "Password not reset" })
    
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" })
  }
};

const login = async (req, res) => {
  try {
    
    const errors = validationResult(req);
    
    // if there is error then return Error
      if (!errors.isEmpty()) {
        return res.status(400).send({
        success: false,
        errors: errors.errors[0],
    });
  }

    // Get user input
    const { phone, password } = req.body;

    // Validate if user exist in our database
    const users = await User.findOne({ phone: (phone.replace(/[- )(]/g,'')).trim(), isDeleted:false }, { tokens: 0 , createdAt:0 , updatedAt:0 }).lean(true);
    
    if (users && users.password === md5(password)) {

      // Create token
      const token = jwt.sign({user : users}, process.env.ACCESS_TOKEN_SECERT, { expiresIn: '5d' });

      //Update the user data
      await User.updateOne({ _id: users._id, isDeleted: false },  { $push: { tokens: token } });

      // // user
      // const loginUser = await Redis.hGetAll(`organization:user:${organizationUser._id.toString()}`);
      // if (Object.keys(loginUser).length == 0) {
      //   await Redis.hSet(`organization:user:${String(organizationUser._id)}`, organizationUser, 7200);
      // }

      return res.status(200).send({
        token: token,
        message: 'Login Successfully'
      });
    }
    return res.status(400).send({ message: "Invalid Username and Password" });
  } catch (error) {
    // error response
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const test = async (req, res) => {
  try {
    console.log(req.user)
    return res.status(200).send({
      users: req.user,
      message: 'Login Successfully'
    });
  } 
 catch (error) {
  // error response
  return res.status(500).send({ message: "Something went wrong" });
}
}

const logout = async (req, res) => {
  try {
    // split the authenticate token
    const { 1: authToken } = req.headers.authorization.split(' ');

    // decode the token
    const decodeToken = jwt.decode(authToken);
  
    //update the database by removing the token
    User.updateOne({ _id: decodeToken.user._id }, { $pull: { tokens: authToken } }).then();

    // await Redis.del(`organization:user:${decodeToken.userId.toString()}`);

    // send success response
    return res.status(200).send({
        message: "Logout Successfully"
      });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong" });
  }
}

module.exports = { registerUser, verifyOTP, signup, forgotPassword, verifyForgotPasswordOTP, resetPassword , login ,test, logout};