import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();
  const pendingDeliveries = await Order.find({
    paymentMethod: 'cod', 
    paid: false,
  }).sort({ createdAt: -1 });  

  res.json(pendingDeliveries);
}
