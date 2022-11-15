const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema;

const cartSchema = new schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    products: [
      {
        item: {
          type: mongoose.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    qty: {
      type: Number,
    },
    subtotal: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("carts", cartSchema);

