import mongoose,{Schema, model, models} from "mongoose";

const UserSchema = new Schema ({
  
   fullname:String,
   email:String,
   password:String,
   phoneNumber:String,
   idnumber:String,
   role:String
},{
    timestamps:true
})
export const User = models?.User || model ('User', UserSchema)