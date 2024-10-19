import mongoose,{Schema, model, models} from "mongoose";

const MealSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  prices: [{ type: Number, required: true }],
  image: { type: String },
  basePrice: { type: String },
  category: { type: [String], required: true },
  purchaseCount: { type: Number, default: 0 }
}, {
  timestamps: true,
});

export const Meal = models.Meal || model('Meal', MealSchema);
