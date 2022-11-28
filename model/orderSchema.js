const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema;


const orderSchema = new schema({

    address:{
        name: String,
        house: String,
        post:String,
        city:String,
        district:String,
        state:String,
        zip:Number,
        country:String,
        phone:String,
        email:String,
    },
    user:{type:mongoose.Types.ObjectId,
          ref:'users'
        },
    payment:String,
    products:Array,
    totalamount:Number,
    status:String,
},
{
  timestamps:true,
    
})



module.exports = mongoose.model("orders", orderSchema);