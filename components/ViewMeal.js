import { useState } from "react";
import Spinner from "./Spinner";

export default function ViewMeal({
  name: existingName,
  description: existingDescription,
  prices: existingPrices,  
  image: existingImage,
  category:existingCategory,
  

}) {
 
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{existingName}</h2>
      <p className="text-gray-700 text-lg mb-6">{existingDescription}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div
              
              className="h-32 md:h-40 bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden"
            >
              <img
                src={existingImage}
                alt={existingName}
                className="w-full h-full object-cover"
              />
            </div>

      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800">Available Prices:</h3>
        <ul className="text-gray-700 text-lg font-bold">
          {existingPrices.length > 0 ? (
            existingPrices.map((price, index) => (
              <li key={index}>Ksh {price.toLocaleString()}</li>
            ))
          ) : (
            <p className="text-gray-500">No prices available</p>
          )}
        </ul>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800">Time for the meal</h3>
        <ul className="text-gray-700 text-lg font-bold">
          {existingCategory.length > 0 ? (
            existingCategory.map((category, index) => (
              <li key={index}>Ksh {category.toLocaleString()}</li>
            ))
          ) : (
            <p className="text-gray-500">No prices available</p>
          )}
        </ul>
      </div>
    </div>
  );
}
