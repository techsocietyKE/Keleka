import { mongooseConnect } from "@/lib/mongoose";
import { Meal } from "@/models/Meal";

export default async function handler(req, res) {
  try {
    await mongooseConnect();

    const { category } = req.query;

    let meals;
    if (category) {
      // Fetch meals that include the specified category
      meals = await Meal.find({ category: { $in: [category] } });
    } else {
      // Fetch all meals if no category is specified
      meals = await Meal.find();
    }

    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: "Failed to load meals." });
  }
}
