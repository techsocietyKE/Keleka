import mongoose,{Schema, model, models} from "mongoose";

const CategorySchema = new Schema ({
   CategorySchemaname:String,
},{
    timestamps:true
})
export const Category = models?.Category || model ('Category', CategorySchema)