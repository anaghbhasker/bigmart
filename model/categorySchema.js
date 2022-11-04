const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema=mongoose.Schema


const categorySchema= new schema ({

    category_name:{type: String, required: true, trim:true},
    category_description:{type: String},
    product_count: {
    type: Number,
  },
  category_thumbnail:{type: String},
  contentType:{type: String},
  imageBase64:{type:String}
 
},
{
  timestamps:true,
}


)

const cateogry= mongoose.model("categorys",categorySchema )
module.exports  =cateogry