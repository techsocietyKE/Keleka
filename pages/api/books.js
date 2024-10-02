
import {mongooseConnect} from "@/lib/mongoose";
import { Book } from "@/models/Book";


export default async function handle(req,res){
   const {method} = req;
   await mongooseConnect()


    if (method === 'GET') {
        if  (req.query.id) {
            res.json(await Book.findOne({_id:req.query.id}))
        }else{
            res.json(await Book.find())
        }
    }


    if(method === 'POST'){
        const {title,description,author,price,images,category,genre,createdBy} = req.body;
        const bookDoc =  await Book.create({
            title,description,price,author,images,category,genre,createdBy
        })
        res.json(bookDoc)
    }

    if (method === "PUT"){
        const {title,description,author,price,images,category,genre,createdBy,_id} = req.body;
        await Book.updateOne({_id},{title,description,price,author,images,category,genre,createdBy})
        res.json(true)
    }
    if (method === 'DELETE'){
        if(req.query?.id){
            await Book.deleteOne( { _id : req.query?.id });
            res.json(true)
        }
    }
}