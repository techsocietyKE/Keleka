import { mongooseConnect } from "@/lib/mongoose";
import { Meal } from "@/models/Meal";


export default async function handle(req,res){
    await mongooseConnect();
    const ids = req.body.ids;
    res.json(await Meal.find({_id:ids}))
   
}