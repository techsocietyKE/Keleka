import mongoose,{Schema, model, models} from "mongoose";

const PopularMealSchema = new Schema({
    meal: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
    purchaseCount: { type: Number, default: 0 },
}, {
  timestamps: true,
});
export const PopularMeal = models?.PopularMeal || model('PopularMeal',PopularMealSchema)