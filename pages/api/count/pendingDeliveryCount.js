import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === 'GET') {
    try {
      const pendingDeliveryCount = await Order.countDocuments({ paymentMethod: 'cod' });
      res.json({ count: pendingDeliveryCount });
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching the order count." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
