import mongoose,{Schema, model, models} from "mongoose";

const OrderSchema = new Schema ({
  
    name:String,
    email:String,
    phonenumber:String,
    county:String,
    city:String,
    street:String,
    paid:Boolean,
    paymentMethod:String,
    status:String,
    Mpesa:{type:Boolean, default:false},
},{
    timestamps:true
})
export const Order = models?.Order || model ('Order', OrderSchema)