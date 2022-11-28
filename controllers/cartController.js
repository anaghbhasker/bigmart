const User = require("../model/userSchema");
const Category = require("../model/categorySchema");
const Products = require("../model/productSchema");
const Cart = require("../model/cartSchema");
const { default: mongoose } = require("mongoose");

///////////////////////////////////////////////////////////

async function getDiscountprice(userId) {
  let cart = await Cart.findOne({ user: userId })
    .populate("user")
    .populate("products.item");
  return (discount = cart.products.reduce(
    (acc, cur) => acc + cur.item.discount * cur.quantity,
    0
  ));
}

async function getTotalprice(userId) {
  let cart = await Cart.findOne({ user: userId })
    .populate("user")
    .populate("products.item");
  return (total = cart.products.reduce(
    (acc, cur) => acc + cur.item.price * cur.quantity,
    0
  ));
}

///////////////////////////////////////////////////////////

module.exports.cartPage = async (req, res) => {
  try {
    const userKO = req.session.userKO;
    const cart = await Cart.findOne({ user: userKO })
      .populate("user")
      .populate("products");
    res.locals.cartDetails = cart;
    res.locals.user = req.session.user;
    const userId = res.locals.user._id;
    const cartDetails = await Cart.findOne({ user: userId }).populate(
      "products.item"
    );
    res.locals.cartDetail = cartDetails;

    const total = await getTotalprice(userId);
    const discount = await getDiscountprice(userId);
    res.locals.total = total;
    res.locals.discount = discount;

    res.render("user/cartlist");
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////

module.exports.addCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const productId = mongoose.Types.ObjectId(req.query.id);
    let userCart = await Cart.findOne({ user: userId })
      .populate("user")
      .populate("products.item");
    if (userCart) {
      let proExist = userCart.products.findIndex(
        (product) => product.item._id == productId.toString()
      );
      if (proExist != -1) {
        res.json({ status: "failed" });
      } else {
        const doc = await Cart.findOne({ user: userId }).populate(
          "user",
          "products"
        );
        doc.products.push({ item: productId });
        await doc.save();
        res.json({ status: "success" });
      }
    } else {
      let cartObj = {
        user: userId,
        products: [{ item: productId }],
      };
      await Cart.create(cartObj);
      res.json({ status: "success" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.removeCart = async (req, res) => {
  try {
    const productId = mongoose.Types.ObjectId(req.query.id);
    const userId = mongoose.Types.ObjectId(req.session.user._id);
    const cart = await Cart.findOne({ user: userId });
    cart.products.pull({ item: productId });
    await cart.save();
  } catch (error) {
    console.log(error);
  }
};

///////////////////////////////////////////////////////////

module.exports.qudtyIncre = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId(req.session.user._id);
    const { id, quantity, count } = req.body;

    await Cart.updateOne(
      { user: userId, "products.item": id },
      {
        $inc: {
          "products.$.quantity": count,
        },
      }
    );

    const carts = await Cart.findOne({ user: userId.toString() }).populate(
      "products.item"
    );

    const subtotal = carts.products.reduce(
      (acc, cur) => acc + cur.quantity * cur.item.price,
      0
    );
    const totaldiscount = carts.products.reduce(
      (acc, cur) => acc + cur.quantity * cur.item.discount,
      0
    );
    const total = subtotal - totaldiscount;

    res.json({ status: true, total, subtotal, totaldiscount });
  } catch (error) {
    console.log(error);
  }
};
