import mongoose,{Schema, model, models} from "mongoose";

const MealSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    createdBy: String,
    images: [{ type: String }],
    properties: { type: Map, of: [String] },  // Object to store properties with arrays of values
  }, {
    timestamps: true,
  });
  
 export const Meal = models.Meal || model('Meal',MealSchema)