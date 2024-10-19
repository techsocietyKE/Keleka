import { mongooseConnect } from '@/lib/mongoose';
import { Meal } from '@/models/Meal';
 // Assuming you have a database connection utility

export default async function handler(req, res) {
  await mongooseConnect(); // Ensure your MongoDB connection is established
  
  if (req.method === 'GET') {
    try {
      // Fetch meals, sorted by timesOrdered in descending order
      const popularMeals = await Meal.find({}, 'name timesOrdered') // Only return name and timesOrdered fields
        .sort({ timesOrdered: -1 }) // Sort in descending order
        .limit(10); // Optionally, limit to top 10 most popular meals
      
      return res.status(200).json({ success: true, data: popularMeals });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
