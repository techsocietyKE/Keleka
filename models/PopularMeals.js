import mongoose, { Schema, model, models } from 'mongoose';

const PopularMealSchema = new Schema({
  mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
  timesOrdered: { type: Number, default: 1 },
  date: { type: Date, required: true }
}, {
  timestamps: true
});

export const PopularMeal = models?.PopularMeal || model('PopularMeal', PopularMealSchema);
