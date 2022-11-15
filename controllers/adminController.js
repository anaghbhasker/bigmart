const Admin = require("../model/adminSchema");
const User = require("../model/userSchema");
const Category = require("../model/categorySchema");
const Products = require("../model/productSchema");
const Banners = require("../model/bannerSchema");
const multer = require("multer");
const fs = require("fs");
const { Console } = require("console");

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
module.exports.orders = (req, res) => {
  res.render("admin/orders");
};
module.exports.salesreport = (req, res) => {
  res.render("admin/salesreport");
};
module.exports.coupens = (req, res) => {
  res.render("admin/coupens");
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
      file.forEach((el,i) => {
        fs.rmSync(el.path,{
  
        });
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
    banner_tittle: banner.bannername,
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
