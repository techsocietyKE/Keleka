import mongoose,{Schema, model, models} from "mongoose";

const OrderSchema = new Schema ({
    line_items:Object,
    name:String,
    email:String,
    phonenumber:String,
    county:String,
    city:String,
    street:String,
    paid:Boolean,
},{
    timestamps:true
})
export const Order = models?.Order || model ('Order', OrderSchema)