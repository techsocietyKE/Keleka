import mongoose,{Schema, model, models} from "mongoose";

const MealSchema = new Schema({
  name: { type: String, required: false },
  description: String,
  prices: [{ type: Number, required: false }],
  createdBy: String,
  category: [{ type: String, required: false }],
  image: { type: String },
  timesOrdered: { type: Number, default: 0 }, 
  stockStatus: {
    type: String,
    enum: ["inStock", "outOfStock"],  // Only allows these two values
    default: "inStock",  // Default value when not provided
  },
}, {
  timestamps: true,
});
  
 export const Meal = models.Meal || model('Meal',MealSchema)


