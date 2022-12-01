const Admin = require("../model/adminSchema");
const User = require("../model/userSchema");
const Category = require("../model/categorySchema");
const Products = require("../model/productSchema");
const Banners = require("../model/bannerSchema");
const Order = require("../model/orderSchema");
const Coupen = require("../model/coupenSchema");
const multer = require("multer");
const fs = require("fs");
const moment = require("moment");
const { default: mongoose } = require("mongoose");
const { Console } = require("console");

module.exports.indexpage = async (req, res) => {
  try {
    // console.log(moment().format('LL'));
    let todayDate = new Date();
    let oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);

    /////todayIncome
    let todayIncome = await Order.aggregate([
      {
        $match: {
          createdAt: { todayDate },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalamount" },
        },
      },
    ]);

    /////Last7daysIncome
    let last7daysIncome = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: oneWeekAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalamount" },
        },
      },
    ]);

    /////totalIncome
    let totalIncome = await Order.aggregate([
      {
        $match: {
          createdAt: { $lte: todayDate },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalamount" },
        },
      },
    ]);

    res.locals.todayIncome = todayIncome;
    res.locals.LastSEVENIncome = last7daysIncome;
    res.locals.totalIncome = totalIncome;

    let totalOrderCancel = await Order.aggregate([
      {
        $match: {
          status: "cancel",
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    res.locals.cancelOrder=totalOrderCancel



    let totalUser=await User.find().count()
    let totalCategory=await Category.find().count()
    let totalProduct=await Products.find().count()
    
    res.locals.totalUSER=totalUser
    res.locals.totalCATA=totalCategory
    res.locals.totalPRO=totalProduct


    /////CODpayment
    let codPayment = await Order.aggregate([
      {
        $match: {
          payment: "COD",
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalamount" },
          count: { $sum: 1 },
        },
      },
    ]);

    ////ONLINEpayment
    
    let onlinePayment = await Order.aggregate([
      {
        $match: {
          payment: "ONLINE",
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$totalamount" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.locals.cod=codPayment
    res.locals.online=onlinePayment



    let chartSevenDays = await Order.aggregate([
      {
        $group: {
          _id:{$month:'$createdAt'},
          totalamount: { $sum: "$totalamount" }
        },
      },
      {
        $sort:{
          _id:1
        }
      }
    ]);

    chartSevenDays=JSON.stringify(chartSevenDays)
    res.locals.chart=chartSevenDays



    res.render("admin/indexpage");
  } catch (error) {
    console.log(error);
  }
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
module.exports.products = async (req, res) => {
  let products = await Products.find().populate("category");
  res.locals.producDetails = products;
  res.render("admin/products");
};
module.exports.addProducts = async (req, res) => {
  const category = await Category.find();
  res.locals.categoryDetails = category;
  res.render("admin/addproducts");
};
module.exports.editProduct = async (req, res) => {
  try {
    const category = await Category.find();
    res.locals.categoryDetails = category;
    const productId = req.query.id;
    const product = await Products.findById(productId).populate("category");
    res.locals.productDetails = product;
    res.render("admin/editproduct");
  } catch (error) {
    console.log(error);
  }
};
module.exports.category = async (req, res) => {
  try {
    let categorys = await Category.find();
    res.locals.categoryDetails = categorys;
    res.render("admin/category");
  } catch (error) {
    console.log(error);
  }
};
module.exports.orders = async (req, res) => {
  const orders = await Order.find().populate("user");
  res.locals.orderDetails = orders;
  res.render("admin/orders", { moment: moment });
};
module.exports.salesreport = async (req, res) => {
  let todayDate = new Date();
  let thirtyDaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
  let totalSellsInThisMonth = await Order.aggregate([
    {
      $match: { createdAt: { $gte: thirtyDaysAgo } },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
        totalamount: { $sum: "$totalamount" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.locals.salesReport = totalSellsInThisMonth;
  res.render("admin/salesreport");
};
module.exports.coupens = async (req, res) => {
  const today = new Date();
  const coupen = await Coupen.find();
  res.locals.coupenDetails = coupen;
  res.render("admin/coupens", { moment, today });
};
module.exports.banners = async (req, res) => {
  let banners = await Banners.find();
  res.locals.bannerDetails = banners;
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
    res.redirect("/admin/userlist");
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////

module.exports.addCategory = async (req, res) => {
  try {
    const file = req.file;
    const category = req.body;
    let img = fs.readFileSync(file.path);
    const encode_image = img.toString("base64");
    await Category.create({
      category_name: category.categoryname,
      category_thumbnail: file.originalname,
      contentType: file.mimetype,
      imageBase64: encode_image,
    });
    fs.unlinkSync(file.path);
    res.redirect("/admin/category");
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.query.id;
    await Category.findByIdAndDelete(categoryId);
  } catch (error) {
    console.log(error);
  }
};

module.exports.proCat = async (req, res) => {
  try {
    const catId = req.query.id;
    const productData = await Products.find({ category: catId });
    res.locals.productDet = productData;
    res.render("admin/proBycat");
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////

module.exports.addPOSTroducts = async (req, res) => {
  try {
    const file = req.files;
    const product = req.body;
    let imgArray = file.map((files) => {
      let img = fs.readFileSync(files.path);
      return (encode_image = img.toString("base64"));
    });
    let result = imgArray.map((src, index) => {
      let finalimg = {
        imageName: file[index].originalname,
        contentType: file[index].mimetype,
        imageBase64: src,
      };
      return finalimg;
    });

    await Products.create({
      name: product.productname,
      description: product.productdescripition,
      price: product.productprice,
      category: product.productcategory,
      stock: product.productstock,
      brand: product.productbrand,
      discount: product.productdiscount,
      tags: product.producttage,
      product_image: result,
    });

    try {
      file.forEach((el, i) => {
        fs.rmSync(el.path, {});
      });
    } catch (error) {
      console.log(error);
    }

    res.redirect("/admin/addProducts");
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.query.id;
    await Products.findByIdAndDelete(productId);
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};

module.exports.editpostProducts = async (req, res) => {
  const product = req.body;
  const productId = req.query.id;
  const file = req.files;
  console.log(file);

  if (file[0]) {
    let imgArray = file.map((files) => {
      let img = fs.readFileSync(files.path);
      return (encode_image = img.toString("base64"));
    });
    let result = imgArray.map((src, index) => {
      let finalimg = {
        imageName: file[index].originalname,
        contentType: file[index].mimetype,
        imageBase64: src,
      };
      return finalimg;
    });
    await Products.findByIdAndUpdate(productId, {
      name: product.productname,
      description: product.productdescripition,
      price: product.productprice,
      category: product.productcategory,
      stock: product.productstock,
      brand: product.productbrand,
      discount: product.productdiscount,
      tags: product.producttage,

      product_image: result,
    })
      .then((data) => {
        file.forEach((el, i) => {
          fs.rmSync(el.path, {});
        });
        res.redirect("/admin/products");
      })
      .catch((error) => {
        res.send({ message: error });
      });
  } else {
    await Products.findByIdAndUpdate(productId, {
      name: product.productname,
      description: product.productdescripition,
      price: product.productprice,
      category: product.productcategory,
      stock: product.productstock,
      brand: product.productbrand,
      discount: product.productdiscount,
      tags: product.producttage,
    })
      .then((data) => {
        res.redirect("/admin/products");
      })
      .catch((error) => {
        res.send({ message: error });
      });
  }
};

///////////////////////////////////////////////////////////

module.exports.addBanner = async (req, res) => {
  const file = req.file;
  const banner = req.body;
  let img = fs.readFileSync(file.path);
  const encode_image = img.toString("base64");
  await Banners.create({
    banner_tittle1: banner.bannertittle1,
    banner_tittle2: banner.bannertittle2,
    banner_startprice: banner.bannerprice,
    banner_thumbnail: file.originalname,
    contentType: file.mimetype,
    imageBase64: encode_image,
  });
  fs.unlinkSync(file.path);
  res.redirect("/admin/banners");
};

module.exports.deleteBanner = async (req, res) => {
  const bannerId = req.query.id;
  await Banners.findByIdAndDelete(bannerId);
};

///////////////////////////////////////////////////////////

module.exports.orderPlaced = async (req, res) => {
  try {
    const orderId = req.query.id;
    await Order.findByIdAndUpdate(orderId, { $set: { status: "placed" } });
    res.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
  }
};

module.exports.orderShipping = async (req, res) => {
  try {
    const orderId = req.query.id;
    await Order.findByIdAndUpdate(orderId, { $set: { status: "shipping" } });
    res.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
  }
};

module.exports.orderDelivered = async (req, res) => {
  try {
    const orderId = req.query.id;
    await Order.findByIdAndUpdate(orderId, { $set: { status: "delivered" } });
    res.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
  }
};

module.exports.orderCancel = async (req, res) => {
  try {
    const orderId = req.query.id;
    await Order.findByIdAndUpdate(orderId, { $set: { status: "cancel" } });
    res.redirect("/admin/orders");
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////

module.exports.addCoupen = async (req, res) => {
  try {
    let coupen = req.body;
    let Obj = {
      code: coupen.code,
      discount: coupen.discount,
      minamount: coupen.minamount,
      maxamount: coupen.maxamount,
      enddate: coupen.enddate,
      status: coupen.status,
    };
    await Coupen.create(Obj);
    res.redirect("/admin/coupens");
  } catch (error) {
    console.log(error);
  }
};

module.exports.coupenEnable = async (req, res) => {
  try {
    const coupenId = req.query.id;
    await Coupen.findByIdAndUpdate(coupenId, { $set: { status: "enable" } });
    res.redirect("/admin/coupens");
  } catch (error) {
    console.log(error);
  }
};

module.exports.coupenDisable = async (req, res) => {
  try {
    const coupenId = req.query.id;
    await Coupen.findByIdAndUpdate(coupenId, { $set: { status: "disable" } });
    res.redirect("/admin/coupens");
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////
