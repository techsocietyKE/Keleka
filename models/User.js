import mongoose,{Schema, model, models} from "mongoose";

const UserSchema = new Schema ({
  
   firstname:String,
   lastname:String,
   email:String,
   password:String,
   phonenumber:String,
   idnumber:String,
   role:String
},{
    timestamps:true
})
export const User = models?.User || model ('User', UserSchema)