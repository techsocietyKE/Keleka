import { mongooseConnect } from "@/lib/mongoose";
import { Meal } from "@/models/Meal";

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  if (method === 'GET') {
    if (req.query) {
      try {
        const mealCount = await Meal.countDocuments();
        res.json({ count: mealCount });
      } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching meal count." });
      }
    } else {
      return res.status(400).json({ message: "ID is required." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
