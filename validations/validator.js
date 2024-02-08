const { body } = require("express-validator");

const userDataValidateChainMethod = [

  body("phone")
    .exists({checkFalsy: true}).withMessage("Phone number is required")
    .matches(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/).withMessage("Please enter valid phone number"),

  body("password")
    .exists({checkFalsy: true}).withMessage("Password is required")
    .isLength({ min: 5 }).withMessage("Password should be at least 5 characters")
    .matches(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{5,}$/).withMessage('Password contain 5 character which has at least one uppercase letter, one lowercase letter, and one number')
];

const userOTPVerify = [
  body("otp")
  .exists({checkFalsy: true}).withMessage("OTP is required")
]

const userDataSignup = [
  body("firstName")
    .exists({checkFalsy: true}).withMessage("Please enter the first name")
    .matches(/^[a-zA-Z ]{2,30}$/).withMessage("Please enter valid first name"),
  body("lastName")
    .exists({checkFalsy: true}).withMessage("Please enter the last name")
    .matches(/^[a-zA-Z ]{2,30}$/).withMessage("Please enter valid last name"),
  body("email")
    .exists({checkFalsy: true}).withMessage("Please enter the email")
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).withMessage("Please enter valid email Id"),  
  body("dob")
    .exists({checkFalsy: true}).withMessage("Please enter valid DOB")
]

const forgotPass = [
  body("email")
    .exists({checkFalsy: true}).withMessage("Please enter the email")
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).withMessage("Please enter valid email Id")
]

const resetPass = [
  body("newPassword")
    .exists({checkFalsy: true}).withMessage("Please enter the new Password"),
  body("confirmPassword")
    .exists({checkFalsy: true}).withMessage("Please enter the confirm Password"),  
]

const loginData = [
  body("phone")
  .exists({checkFalsy: true}).withMessage("Phone number is required")
  .matches(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/).withMessage("Please enter valid phone number"),
  body("password")
    .exists({checkFalsy: true}).withMessage("Password is required")
    .isLength({ min: 5 }).withMessage("Password should be at least 5 characters")
    .matches(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{5,}$/).withMessage('Password contain 5 character which has at least one uppercase letter, one lowercase letter, and one number')  
]

module.exports = {
    userDataValidateChainMethod,
    userOTPVerify,
    userDataSignup,
    forgotPass,
    resetPass,
    loginData
  };