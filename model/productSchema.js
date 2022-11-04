const mongoose=require('mongoose')
const bcrypt = require('bcrypt');
const schema=mongoose.Schema

const productSchema= new schema({
  

    name:{type: String, required: true},
    description:{type: String, required: true},
    price: {
    type: Number,
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'categorys',
    required:true,
  },
stock:{
    type:Number, required: true
},
brand:{
  type:String, required: true
},

discount:{
    type:Number,
    default:0
}
,
tags:{
    type:[String],
    required:true,
},

  
  
  imageName:{
    type: String
},
  contentType:{
    type: String
},
  imageBase64:{
    type:String
}
  },



{
  timestamps:true,
}

)
 const product =mongoose.model("products",productSchema )
module.exports =product