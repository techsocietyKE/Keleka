import mongoose,{Schema, model, models} from "mongoose";

const GenreSchema = new Schema ({
   genrename:String,
},{
    timestamps:true
})
export const Genre = models?.Genre || model ('Genre', GenreSchema)