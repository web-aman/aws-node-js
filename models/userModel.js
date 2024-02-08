const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String
    },
    lastName:{
      type: String
    },
    email:{
      type: String
    },
    dob:{
      type: Date
    },
    phone: {
      type: String
    },
    password: {
      type: String
    },
    OTP:{
      type: String,
      required: true,
    },
    isDeleted:{
      type:Boolean,
      default:false
    },
    isEmailVerified:{
      type:Boolean,
      default:false
    },
    profileImage:{
      type:String
    },
    token: {
      type: String
    },
    tokens:{
      type: [String]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);