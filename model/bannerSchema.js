const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema=mongoose.Schema
const bannerSchema= new schema ({

    banner_tittle1:{type: String, required: true},
    banner_tittle2:{type: String, required: true},
    banner_startprice:{type: String, required: true},
  banner_thumbnail:{type: String},
  contentType:{type: String},
  imageBase64:{type:String}
 
},
{
  timestamps:true,
}
)

const banner= mongoose.model("banners",bannerSchema )
module.exports  =banner