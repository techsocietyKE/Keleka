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
    Confirmed:{
        type: Boolean,
        default: false
    },  
    Delivered:{
        type: Boolean,
        default: false
    }, 
    Mpesa:{type:Boolean, default:false},
    DeliveryStatus: {
        type: String,        
        default: "Pending",   
      },
},{
    timestamps:true
})
export const Order = models?.Order || model ('Order', OrderSchema)