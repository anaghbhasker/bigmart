const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema=mongoose.Schema
const bannerSchema= new schema ({

    banner_tittle:{type: String, required: true},
    banner_description:{type: String},
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