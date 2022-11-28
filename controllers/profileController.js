const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const Category = require("../model/categorySchema");
const Products = require("../model/productSchema");
const Banners = require("../model/bannerSchema");
const Cart = require("../model/cartSchema");
const Order =require("../model/orderSchema");
const Coupen=require('../model/coupenSchema')
const { loginpage } = require("./userController");
const { default: mongoose } = require("mongoose");
const moment = require("moment");




///////////////////////////////////////////////////////////


module.exports.accountPage=async(req,res)=>{
    try {
      const userKO=req.session.userKO
      const cart = await Cart.findOne({user:userKO}).populate('user').populate('products')
      res.locals.cartDetails=cart
      res.locals.user = req.session.user
  
      const result = await User.findById(userKO).populate("address");
      res.locals.addressDetails = result;

      const order= await Order.find({user:userKO}).populate({
        path:'products',
        populate:{
            path:'item',
            model:'products'
        }
    })
      res.locals.orderDetails=order
      const coupen= await Coupen.find()
      res.locals.coupenDetails=coupen
      res.render('user/account',{ moment: moment })
    } catch (error) {
      console.log(error);
    }
  }




  module.exports.editProfile=async(req,res)=>{
    try {
        const userId = req.session.user._id
        const userDetail=req.body
        let newObj
        if (!userDetail.newpassword) {
             newObj = {
                fullname: userDetail.fullname,
                email: userDetail.email,
            }
        } else {
            
            userDetail.newpassword= await bcrypt.hash(userDetail.newpassword,10)
            newObj = {
                fullname: userDetail.fullname,
                email: userDetail.email,
                password: userDetail.newpassword
            }
            
        }
        await User.findByIdAndUpdate(userId,newObj)
        res.redirect('/userlogin')
    } catch (error) {
        console.log(error);
    }
  }



  module.exports.cancelOrder=async(req,res)=>{
    try {
        const orderId=req.query.id
        await Order.findByIdAndUpdate(orderId,{$set:{status:"cancel"},})
    } catch (error) {
        console.log(error);
    }
  }