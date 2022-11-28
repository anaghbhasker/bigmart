const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const Category = require("../model/categorySchema");
const Products = require("../model/productSchema");
const Banners = require("../model/bannerSchema");
const fs = require("fs");
const twilio = require("../OTPVERIFY/twilio");
const Cart = require("../model/cartSchema");
let phoneNum;
let userOTP;
///////////////////////////////////////////////////////////

module.exports.homepage = async (req, res) => {
 
  const userKO=req.session.userKO
  const cart = await Cart.findOne({user:userKO}).populate('user').populate('products')
  res.locals.cartDetails=cart
  res.locals.user = req.session.user
  let categorys = await Category.find();
  res.locals.categoryDetails = categorys;
  const products = await Products.find().populate("category");
  res.locals.productDetails = products;
  const banner = await Banners.find();
  res.locals.bannerDetails = banner;
  res.render("user/home");
};
module.exports.signuppage = (req, res) => {
  res.render("user/usersignup");
};
module.exports.loginpage = (req, res) => {
  res.render("user/userlogin");
};

module.exports.productquickview = async (req, res) => {
  try {
    const productId = req.query.id;
    const productDetails=await Products.findById(productId).populate("category");
    res.json(productDetails)  
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////

module.exports.userpostsignup = async (req, res) => {
  try {
    const userData = { ...req.body };
    let email = await User.findOne({ email: userData.email });
    if (!email) {
      userData.password = await bcrypt.hash(userData.password, 10);
      phoneNum = req.body.phone;
      twilio.otpSend(phoneNum);
      await User.create(userData);
      userOTP = await User.findOne({ email: userData.email });
      res.redirect("/getotp");
    } else {
      res.render("user/usersignup", { message: "Your email already defined" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.getOtppage = (req, res) => {
  res.render("user/getotp");
};

module.exports.postOtp = async (req, res) => {
  const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body;
  const otpArr = [];
  otpArr.push(otp1, otp2, otp3, otp4, otp5, otp6);
  const otp = otpArr.join("");
  twilio.otpVerify(phoneNum, otp, abc);
  function abc(ac) {
    if (ac) {
      userOTP.otpVerify = true;
      userOTP.save();
      res.redirect("/userlogin");
      phoneNum = null;
      userOTP = null;
    } else {
      res.render("user/getotp", { message: "Invalid otp!!!" });
    }
  }
};

module.exports.resendOtp = (req, res) => {
  twilio.otpSend(phoneNum);
  res.redirect("/getotp");
};

module.exports.userpostLogin = async (req, res) => {
  try {
    const userLogindetails = req.body;
    let userEmail = await User.findOne({ email: userLogindetails.email });
    if (userEmail) {
      const userResult = await bcrypt.compare(
        userLogindetails.password,
        userEmail.password
      );
      if (userResult) {
        if (!userEmail.isBanned) {
          if (userEmail.otpVerify === true) {
            req.session.userLogged = true;
            req.session.user = userEmail;
            req.session.userKO=userEmail._id
            res.redirect("/");
          } else {
            twilio.otpSend(phoneNum);
            res.redirect("/getotp");
          }
        } else {
          res.render("user/userlogin", { message: "Your account is blocked" });
        }
      } else {
        res.render("user/userlogin", { message: "Incorrect password" });
      }
    } else {
      res.render("user/userlogin", { message: "Your email is invalid" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.userLogout = (req, res) => {
  req.session.destroy();
  res.render("user/userlogin");
};

///////////////////////////////////////////////////////////

