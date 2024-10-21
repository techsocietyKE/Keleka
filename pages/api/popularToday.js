
import { mongooseConnect } from "@/lib/mongoose";
import { PopularMeal } from "@/models/PopularMeals";
import moment from "moment";

export default async function handle(req, res) {
    await mongooseConnect();
    
    
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    try {
        
        const popularMeals = await PopularMeal.find({
            date: { $gte: startOfDay, $lt: endOfDay }
        })
        .sort({ timesOrdered: -1 })  
        .populate('mealId'); 

        res.status(200).json({ success: true, popularMeals });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
