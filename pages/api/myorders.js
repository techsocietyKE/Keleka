import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { Order } from "@/models/Order";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await mongooseConnect();

    // Fetch only the first three orders for the user
    const userOrders = await Order.find({ userId: session.user.id }).limit(3);
    return res.status(200).json({ orders: userOrders });
  } catch (error) {
    console.error('Error in myorders API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
