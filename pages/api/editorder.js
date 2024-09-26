import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { id } = req.query; // Get the order ID from the query params
  const { method } = req;

  // Connect to the database
  const { db } = await connectToDatabase();

  switch (method) {
    // Handle updating the order (PUT request)
    case 'PUT':
      try {
        // Get the data from the request body
        const { name, email, phonenumber, county, street, paid } = req.body;

        // Update the order in the database
        const result = await db.collection('orders').updateOne(
          { _id: new ObjectId(id) },  // Find the order by its ID
          {
            $set: {
              name,
              email,
              phonenumber,
              county,
              street,
              paid
            }
          }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: 'Order not found or no changes made' });
        }

        // Return a success message
        return res.status(200).json({ message: 'Order updated successfully' });
      } catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ message: 'Failed to update order' });
      }

    // Handle unsupported methods
    default:
      res.setHeader('Allow', ['PUT']);
      return res.status(405).json({ message: `Method ${method} Not Allowed` });
  }
}
