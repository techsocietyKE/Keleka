
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
        const {name,description,price,images,prices,properties,createdBy} = req.body;
        const mealDoc =  await Meal.create({
            name,description,price,images,properties,createdBy,
        })
        res.json(mealDoc)
    }

    if (method === "PUT"){
        const {name,description,price,images,properties,createdBy,_id} = req.body;
        await Meal.updateOne({_id},{name,description,price,images,properties,createdBy,})
        res.json(true)
    }
    if (method === 'DELETE'){
        if(req.query?.id){
            await Meal.deleteOne( { _id : req.query?.id });
            res.json(true)
        }
    }
}