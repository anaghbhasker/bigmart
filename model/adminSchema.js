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

module.exports  = mongoose.model("admins",adminSchema )
