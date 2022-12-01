const User = require("../model/userSchema");
const Category = require("../model/categorySchema");
const Products = require("../model/productSchema");
const Cart = require("../model/cartSchema");
const Order = require("../model/orderSchema");
const Coupen = require("../model/coupenSchema");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");
const moment = require("moment");



let coupenCount;

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

module.exports.coupenapply = async (req, res,next) => {
  try {
    let message;
    const userKO = req.session.userKO;
    const subtotal = await getTotalprice(userKO);
    const totaldiscount = await getDiscountprice(userKO);
    const total = subtotal - totaldiscount;
    const today = new Date()

    let coupenCode = req.body.valueCoupen;
    let coupenCheck = await Coupen.findOne({ code: coupenCode });


    if (coupenCheck) {
        if (total>coupenCheck.minamount) {
            if(total<coupenCheck.maxamount){
                if (today<coupenCheck.enddate) {
                    const userCheck=coupenCheck.users.includes(userKO)
                    if (!userCheck) {
                        await Coupen.updateOne({code:coupenCode},{ $push: { users: userKO } })
                        coupenCount=(total*coupenCheck.discount)/100
                        console.log(coupenCount);
                        message="Coupen apply successfully!!"
                        res.json({ status: true, message });
                    } else {
                        message="Sorry!!coupen is already redeemed"
                        res.json({ status: true, message });
                    }
                } else {
                    message="Sorry!!this coupon code has expired"
                    res.json({ status: true, message });
                }
            }else{
                message="Sorry!! this Coupon is only valid for purchase of below "+coupenCheck.maxamount+"₹"
                res.json({ status: true, message });
            }
        } else {
            message="Sorry!! this Coupon is only valid for purchase of above "+coupenCheck.minamount+"₹"
            res.json({ status: true, message });
        }
    } else {
        message="Sorry!! your coupen code is not valid"
        res.json({ status: true, message });
    }







  }catch (error) {
    next(error)
  }
};

///////////////////////////////////////////////////////////

module.exports.checkoutPage = async (req, res,next) => {
  try {
    res.locals.user = req.session.user;
    const userKO = req.session.userKO;
    const cart = await Cart.findOne({ user: userKO })
      .populate("user")
      .populate("products");
    res.locals.cartDetails = cart;

    const cartDetails = await Cart.findOne({ user: userKO }).populate(
      "products.item"
    );
    res.locals.cartDetail = cartDetails;

    const subtotal = await getTotalprice(userKO);
    const totaldiscount = await getDiscountprice(userKO);
    let total = subtotal - totaldiscount;
    res.locals.subtotal = subtotal;
    res.locals.totaldiscount = totaldiscount;
    if (coupenCount) {
        total=total-coupenCount
        res.locals.total = total;
    } else {
        res.locals.total = total;
    }
    const result = await User.findById(userKO).populate("address");
    res.locals.addressDetails = result;

    res.render("user/checkout",{coupenCount});
  } catch (error) {
    next(error)
  }
};

///////////////////////////////////////////////////////////

module.exports.thankYoupage = async (req, res,next) => {
  try {
    const userKO = req.session.userKO;
    const cart = await Cart.findOne({ user: userKO })
      .populate("user")
      .populate("products");
    res.locals.cartDetails = cart;
    res.locals.user = req.session.user;

    const orderKO = req.session.orderKO;
    const order = await Order.findOne({ _id: orderKO }).populate({
      path: "products",
      populate: {
        path: "item",
        model: "products",
      },
    });
    res.locals.orderDetails = order;

    const orderCount = await Order.find({ user: userKO });
    res.locals.orderCOUNT = orderCount;
    const coupen = await Coupen.find();
    res.locals.coupenDetails = coupen;
    res.render("user/thankyou", { moment: moment });
  } catch (error) {
    next(error)
  }
};

///////////////////////////////////////////////////////////

module.exports.addAddress = async (req, res,next) => {
  try {
    let userId = req.session.user._id;
    const addressDetails = req.body;
    const result = await User.findOne({ _id: userId });
    const isMatch = result.address.some(
      (el) => el.house === addressDetails.house
    );
    if (!isMatch) {
      await User.findByIdAndUpdate(userId, {
        $push: { address: [addressDetails] },
      });
      res.json({ status: "success" });
    } else {
      res.json({ status: "false" });
    }
  } catch (error) {
    next(error)
  }
};

module.exports.removeAddress = async (req, res,next) => {
  try {
    const addressId = req.query.id;
    const userId = req.session.userKO;
    await User.findByIdAndUpdate(userId, {
      $pull: { address: { _id: addressId } },
    });
  } catch (error) {
    next(error)
  }
};

///////////////////////////////////////////////////////////

module.exports.placeOrder = async (req, res,next) => {
  try {
    let userId = req.session.user._id;
    let addressId = req.query.addressId;
    let payment = req.body;
    /////address
    let address = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          address: 1,
        },
      },
      {
        $unwind: {
          path: "$address",
        },
      },
      {
        $match: {
          "address._id": mongoose.Types.ObjectId(addressId),
        },
      },
    ]);
    address = address[0].address;
    /////address
    let status = payment.payment === "COD" ? "placed" : "pending";
    let cart = await Cart.findOne({ user: userId })
      .populate("user")
      .populate("products.item");
    let subtotal = await getTotalprice(userId);
    let totaldiscount = await getDiscountprice(userId);
    let total;

    if (coupenCount) {
        total = subtotal - totaldiscount;
        total=total-coupenCount
        coupenCount=null
    } else {
        total = subtotal - totaldiscount;
    }

    const orderObj = {
      address: {
        name: address.name,
        house: address.house,
        post: address.post,
        city: address.city,
        district: address.district,
        state: address.state,
        zip: address.zip,
        country: address.country,
        phone: address.phone,
        email: address.email,
      },
      user: userId,
      payment: payment.payment,
      products: cart.products,
      totalamount: total,
      status: status,
    };

    await Order.create(orderObj).then(async (data) => {
      let orderId = data._id.toString();
      req.session.orderKO = orderId;

      if (payment.payment === "COD") {
        await Cart.updateOne({ user: userId }, { $set: { products: [] } });
        res.json({ status: true });
      } else {
        var instance = new Razorpay({
          key_id: process.env.key_id,
          key_secret: process.env.key_secret,
        });
        let amount = total;

        instance.orders.create(
          {
            amount: amount * 100,
            currency: "INR",
            receipt: orderId,
          },
          (err, order) => {
            res.json({ status: false, order });
          }
        );
      }
    });
  } catch (error) {
    next(error)
  }
};

///////////////////////////////////////////////////////////

module.exports.verifyPayment = async (req, res,next) => {
  try {
    const userId = req.session.user._id;
    const details = req.body;

    let hmac = crypto.createHmac("sha256", process.env.key_secret);
    hmac.update(
      details["payment[razorpay_order_id]"] +
        "|" +
        details["payment[razorpay_payment_id]"]
    );
    hmac = hmac.digest("hex");

    const orderId = req.body["order[receipt]"];

    if (hmac == details["payment[razorpay_signature]"]) {
      console.log("payment successfull");
      await Cart.updateOne({ user: userId }, { $set: { products: [] } });
      await Order.findByIdAndUpdate(orderId, {
        $set: {
          status: "placed",
        },
      })
        .then((data) => {
          res.json({ status: true, data });
        })
        .catch((err) => {
          console.log("payment failed");
          res.json({ status: false, err });
        });
    } else {
      res.json({ status: false });
      console.log("Something error");
    }
  } catch (error) {
    next(error)
  }
};
