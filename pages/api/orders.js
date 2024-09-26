import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req,res){
    await mongooseConnect();
    res.json(await Order.find().sort({createdAT:-1}))
}