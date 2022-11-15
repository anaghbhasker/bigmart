const mongoose=require('mongoose')
const schema=mongoose.Schema


const adminSchema = new schema({
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim:true,
  },
  password: {
    type: String,
    trim:true,
    required: true,
  }
});
const admin=mongoose.model("admins",adminSchema )
module.exports  = admin
