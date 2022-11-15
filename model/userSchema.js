const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema;

const userSchema = new schema(
  {
    fullname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    isBanned: { type: Boolean, default: false },
    otpVerify: { type: Boolean, default: false },
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "products",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);