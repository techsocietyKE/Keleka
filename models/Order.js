import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  product_items: Object,
  fullname: String,
  email: String,
  phoneNumber: String,
  grandTotal: String,
  userId: String,
  extrainfo: {
    type: String,
    required: false,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  Mpesa: {
    type: Boolean,
    default: false,
  },
  Confirmed: {
    type: Boolean,
    default: false,
  },
  paymentMethod: String,
}, {
  timestamps: true
});

export const Order = models?.Order || model('Order', OrderSchema);
