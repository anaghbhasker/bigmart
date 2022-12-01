const User = require("../model/userSchema");
const Category = require("../model/categorySchema");
const Products = require("../model/productSchema");
const Cart = require("../model/cartSchema");

///////////////////////////////////////////////////////////

module.exports.shopPage = async (req, res,next) => {
  try {
    const userKO = req.session.userKO;
    const cart = await Cart.findOne({ user: userKO })
      .populate("user")
      .populate("products");
    res.locals.cartDetails = cart;
    res.locals.user = req.session.user;
    let categorys = await Category.find();
    res.locals.categoryDetails = categorys;
    const products = await Products.find().populate("category");
    res.locals.productDetails = products;
    res.render("user/shop");
  } catch (error) {
   next(error)
  }
};

module.exports.wishList = async (req, res) => {
  try {
    const userKO = req.session.userKO;
    const cart = await Cart.findOne({ user: userKO })
      .populate("user")
      .populate("products");
    res.locals.cartDetails = cart;
    res.locals.user = req.session.user;
    const userId = res.locals.user._id;
    const result = await User.findById(userId).populate("wishlist");
    res.locals.productsDetails = result;
    res.render("user/wishlist");
  } catch (error) {
    console.log(error);
  }
};
///////////////////////////////////////////////////////////

module.exports.getProduct = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const product = await Products.find({ category: categoryId });
    res.json(product);
  } catch (error) {
    console.log(error);
  }
};

module.exports.productDetails = async (req, res) => {
  try {
    res.locals.user = req.session.user;
    const productId = req.query.id;
    const productDetail = await Products.findById(productId).populate(
      "category"
    );
    res.locals.productDetails = productDetail;
    res.render("user/productDetails");
  } catch (error) {
    console.log(error);
  }
};

module.exports.productDetail = async (req, res) => {
  try {
    const userKO=req.session.userKO
    const cart = await Cart.findOne({user:userKO}).populate('user').populate('products')
    res.locals.cartDetails=cart
    res.locals.user = req.session.user;
    const productId = req.query.id;
    const productDetail = await Products.findById(productId).populate(
      "category"
    );
    res.locals.productDetails = productDetail;
    res.render("user/productDetails");
  } catch (error) {
    console.log(error);
  }
};

module.exports.addWishlist = async (req, res) => {
  try {
    let userId = req.session.user._id;
    let productId = req.query.id;
    const result = await User.findOne({ _id: userId });
    const productFind = await result.wishlist.includes(productId);
    if (!productFind) {
      await User.findByIdAndUpdate(userId, {
        $push: { wishlist: [productId] },
      });
      res.json({ status: "success" });
    } else {
      res.json({ status: "false" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.removeWishlist = async (req, res) => {
  try {
    let user = req.session.user;
    let productId = req.query.id;
    if (user) {
      const userId = req.session.user._id;
      await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } });

      res.redirect("/wishlist");
    } else {
      console.log("Please Login Your Account");
    }
  } catch (error) {
    console.log(error);
  }
};
