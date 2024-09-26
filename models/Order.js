import mongoose,{Schema, model, models} from "mongoose";

const OrderSchema = new Schema ({
    book_items:Object,
    name:String,
    email:String,
    phonenumber:String,
    county:String,
    city:String,
    street:String,
    amount:String,
    paid:{
        type: Boolean,
        default: false
    }, 
    Mpesa:{
        type: Boolean,
        default: false
    },  
},{
    timestamps:true
})
export const Order = models?.Order || model ('Order', OrderSchema)
