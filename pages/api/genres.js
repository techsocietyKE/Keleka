
import {mongooseConnect} from "@/lib/mongoose";
import { Genre } from "@/models/Genre";

export default async function handle(req,res){
   const {method} = req;
   await mongooseConnect()
//    await isAdminRequest(req, res);

    if (method === 'GET') {
        if  (req.query.id) {
            res.json(await Genre.findOne({_id:req.query.id}))
        }else{
            res.json(await Genre.find())
        }
    }


    if(method === 'POST'){
        const {genrename} = req.body;
        const genreDoc =  await Genre.create({
            genrename
        })
        res.json(genreDoc)
    }

    if (method === "PUT"){
        const {genrename,_id} = req.body;
        await Genre.updateOne({_id},{genrename})
        res.json(true)
    }
    if (method === 'DELETE'){
        if(req.query?.id){
            await Genre.deleteOne( { _id : req.query?.id });
            res.json(true)
        }
    }
}