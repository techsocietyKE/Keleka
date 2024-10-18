import { mongooseConnect } from "@/lib/mongoose";
import { Meal } from "@/models/Meal";

export default async function handler(req, res) {
  try {
    await mongooseConnect();
    const meals = await Meal.find();
    console.log(meals) 
    res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: "Failed to load meals." });
  }
}
