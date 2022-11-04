const Admin = require("../model/adminSchema");
const User = require("../model/userSchema");
const Category = require("../model/categorySchema");
const Products= require('../model/productSchema')
const fs= require('fs')

module.exports.indexpage = (req, res) => {
  res.render("admin/indexpage");
};
module.exports.userlist = async (req, res) => {
  try {
    let users = await User.find();
    req.session.userDetails = users;
    res.locals.userDetails = req.session.userDetails;
    res.render("admin/userlist");
  } catch (error) {
    console.log(error);
  }
};
module.exports.products = async(req, res) => {
  let products= await Products.find().populate('category')
  res.locals.producDetails=products
  res.render("admin/products");
};
module.exports.addProducts=async (req,res)=>{

  const category= await Category.find()
  res.locals.categoryDetails = category
  res.render('admin/addproducts')
}
module.exports.category = async(req, res) => {
  try {
    let categorys = await Category.find()
    res.locals.categoryDetails = categorys
    res.render("admin/category");
  } catch (error) {
    console.log(error);
  }
};
module.exports.orders = (req, res) => {
  res.render("admin/orders");
};
module.exports.salesreport = (req, res) => {
  res.render("admin/salesreport");
};
module.exports.coupens = (req, res) => {
  res.render("admin/coupens");
};
module.exports.banners = (req, res) => {
  res.render("admin/banners");
};



///////////////////////////////////////////////////////////

module.exports.adminpostLogin = async (req, res) => {
  try {
    const adminData = req.body;
    const email = await Admin.findOne({ email: adminData.adminEmail });
    if (email) {
      if (email.password === adminData.adminPassword) {
        req.session.adminLogged = true;
        res.json({ status: true });
      } else {
        errorEmail = "Your password is invalid..!!";
        res.json({ errorEmail });
      }
    } else {
      errorEmail = "Please enter your email..!!";
      res.json({ errorEmail });
    }
  } catch (error) {
    console.log(error.message);
  }
};

///////////////////////////////////////////////////////////

module.exports.admingetLogin = (req, res) => {
  if (req.session.adminLogged) {
    res.redirect("/");
  } else {
    res.render("admin/adminlogin");
  }
};

module.exports.adminLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};

///////////////////////////////////////////////////////////

module.exports.userBlock = async (req, res) => {
  try {
    const userId = req.query.id;
    const user = await User.findById(userId);
    user.isBanned = !user.isBanned;
    await user.save();
    res.redirect("/admin/userlist");
  } catch (error) {
    console.log(error);
  }
};

module.exports.userUnblock = async (req, res) => {
  try {
    const userId = req.query.id;
    const user = await User.findById(userId);
    user.isBanned = !user.isBanned;
    await user.save();
    res.redirect('/admin/userlist')
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////


module.exports.addCategory =async(req,res)=>{
  try {
    const file=req.file
    const category=req.body
    let img = fs.readFileSync(file.path)
    const encode_image = img.toString('base64')
    await Category.create({category_name:category.categoryname, category_thumbnail: file.originalname,
      contentType: file.mimetype,
      imageBase64: encode_image});
      fs.unlinkSync(file.path)
    res.redirect('/admin/category')
  } catch (error) {
    console.log(error);
  }
}

module.exports.deleteCategory =async(req,res)=>{
  try {
    const categoryId = req.query.id;
    await Category.findByIdAndDelete(categoryId);
    res.redirect('/admin/category')
  } catch (error) {
    console.log(error);
  }
}


///////////////////////////////////////////////////////////


module.exports.addPOSTroducts=async(req,res)=>{
  try {
    const file=req.file
    const product=req.body
    let img = fs.readFileSync(file.path)
    const encode_image = img.toString('base64')
    await Products.create({name:product.productname,description:product.productdescripition,price:product.productprice,category:product.productcategory,stock:product.productstock,brand:product.productbrand,discount:product.productdiscount,tags:product.producttage ,imageName: file.originalname,
      contentType: file.mimetype,
      imageBase64: encode_image})
      fs.unlinkSync(file.path)
      res.redirect('/admin/addProducts')  
  } catch (error) {
    console.log(error);
  }
}




module.exports.deleteProduct=async(req,res)=>{
  try {
    const productId = req.query.id;
    await Products.findByIdAndDelete(productId);
    res.redirect('/admin/products')
  } catch (error) {
    console.log(error);
  }
}