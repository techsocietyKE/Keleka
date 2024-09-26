import { mongooseConnect } from "@/lib/mongoose";
import { Book } from "@/models/Book";

export default async function handle(req,res){
    await mongooseConnect();
    const ids = req.body.ids;
    res.json(await Book.find({_id:ids}))
    // console.log(ids)
}