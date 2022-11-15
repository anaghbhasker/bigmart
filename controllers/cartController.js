const User = require("../model/userSchema");
const Category = require("../model/categorySchema");
const Products = require("../model/productSchema");
const Cart = require("../model/cartSchema");
const { default: mongoose } = require("mongoose");

///////////////////////////////////////////////////////////

module.exports.cartPage = async (req,res)=>{
    try {
      const userId=req.session.user._id
      console.log();
      res.render('user/cartlist')
    } catch (error) {
        console.log(error); 
    }
}



module.exports.addCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const productId = mongoose.Types.ObjectId(req.query.id);
    let userCart = await Cart.findOne({ user: userId })
      .populate("user")
      .populate("products.item");
    if (userCart) {
        let proExist = userCart.products.findIndex(product => product.item._id == productId.toString())
        if (proExist != -1) {
            res.json({ status: "failed" });
        } else {
            const doc = await Cart.findOne({ user: userId }).populate('user', 'products')
            doc.products.push({item:productId})
            await doc.save()
            res.json({ status: "success" });
        }
    } else {
      let cartObj = {
        user: userId,
        products: [{ item: productId }],
      };
      await Cart.create(cartObj)
      res.json({ status: "success" });
    }
    } catch (error) {
    console.log(error);
  }
};
