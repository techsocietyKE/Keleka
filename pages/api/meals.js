
import {mongooseConnect} from "@/lib/mongoose";
import { Meal } from "@/models/Meal";



export default async function handle(req,res){
   const {method} = req;
   await mongooseConnect();


    if (method === 'GET') {
        if  (req.query.id) {
            res.json(await Meal.findOne({_id:req.query.id}))
        }else{
            res.json(await Meal.find())
        }
    }


    if(method === 'POST'){
        const {name,description,image,prices,category,createdBy} = req.body;
        const mealDoc =  await Meal.create({
            name,description,prices,category,image,createdBy,
        })
        res.json(mealDoc)
    }

    if (method === "PUT"){
        const {name,description,prices,image,category,createdBy,_id} = req.body;
        await Meal.updateOne({_id},{name,description,prices,image,category,createdBy,})
        res.json(true)
    }
    if (method === 'DELETE'){
        if(req.query?.id){
            await Meal.deleteOne( { _id : req.query?.id });
            res.json(true)
        }
    }
}