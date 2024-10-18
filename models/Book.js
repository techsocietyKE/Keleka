import mongoose,{Schema, model, models} from "mongoose";

const  BookSchema = new Schema({
    title:{type:String,required:true},
    author:String,
    description:String,
    genre:String,
    price:[{type:Number, required:true}],
    images:[{type:String}],
},{
    timestamps:true,
})
 export const Book = models.Book || model('Book',BookSchema)