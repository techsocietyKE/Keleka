import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  book_items: Object,
  name: String,
  email: String,
  phonenumber: String,
  county: String,
  city: String,
  street: String,
  amount: String,
  userId: String,
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
  DeliveryStatus: {
    type: String,        
    default: "Pending",   
  },
  paymentMethod: String,
}, {
  timestamps: true
});

export const Order = models?.Order || model('Order', OrderSchema);
