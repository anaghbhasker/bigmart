const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema;



const coupenSchema = new schema({

    code:String,
    discount:{type:Number,trim:true},
    minamount:{type:Number,trim:true},
    maxamount:{type:Number,trim:true},
    enddate:Date,
    status:String,
    users:[
        {type:mongoose.Types.ObjectId,
        ref:'users'
      }
    ]

},
{
  timestamps:true,
}
)




module.exports = mongoose.model("coupens", coupenSchema);