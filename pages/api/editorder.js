// api/editorder
import {mongooseConnect} from "@/lib/mongoose";
import { Order } from "@/models/Order";



export default async function handle(req,res){
   const {method} = req;
   await mongooseConnect()


    if (method === 'GET') {
        if  (req.query.id) {
            res.json(await Order.findOne({_id:req.query.id}))
        }else{
            res.json(await Order.find())
        }
    }


    if(method === 'POST'){
        const {
            paid,Confirmed} = req.body;
        const orderDoc =  await Order.create({
            paid,Confirmed
        })
        res.json(orderDoc)
    }

    if (method === "PUT"){
        const {paid,Confirmed,_id
        } = req.body;
        
        await Order.updateOne({_id},{paid,Confirmed})
        res.json(true);

a
    }
    if (method === 'DELETE'){
        if(req.query?.id){
            await Order.deleteOne( { _id : req.query?.id });
            res.json(true)
        }
    }
}