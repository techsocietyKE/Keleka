import { useState } from "react";
import Spinner from "./Spinner";

export default function ViewMeal({
  name: existingName,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  properties: existingProperties,
}) {
  const [properties, setProperties] = useState(existingProperties || {});

  // Remove a specific property value
  function removePropertyValue(propName, value) {
    const updatedValues = properties[propName].filter((val) => val !== value);
    setProperties({
      ...properties,
      [propName]: updatedValues.length ? updatedValues : undefined,
    });
  }

  // Remove the entire property
  function removeProperty(propName) {
    const updatedProperties = { ...properties };
    delete updatedProperties[propName];
    setProperties(updatedProperties);
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      {/* Meal Name */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{existingName}</h2>

      {/* Meal Description */}
      <p className="text-gray-700 text-lg mb-6">{existingDescription}</p>

      {/* Meal Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {existingImages && existingImages.length > 0 ? (
          existingImages.map((uploadedImage, index) => (
            <div
              key={index}
              className="h-32 md:h-40 bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden"
            >
              <img
                src={uploadedImage}
                alt={`Meal Image ${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <p className="col-span-full text-gray-500">No images available</p>
        )}
      </div>

      {/* Meal Price */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800">Starting Price:</h3>
        <p className="text-gray-700 text-xl font-bold">Ksh {existingPrice}</p>
      </div>

      {/* Meal Properties */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Meal Properties</h3>
        {Object.keys(properties).length > 0 ? (
          <ul className="space-y-4">
            {Object.keys(properties).map((propName) => (
              <li key={propName} className="text-gray-700">
                <strong className="text-gray-800">{propName}:</strong>{" "}
                {properties[propName]?.join(", ") || "No values"}
                <button
                  onClick={() => removeProperty(propName)}
                  className="ml-4 text-red-600 hover:underline"
                >
                  Remove Property
                </button>
                {/* Display values and option to remove individual values */}
                {properties[propName] && properties[propName].length > 0 && (
                  <ul className="list-disc pl-5 mt-2">
                    {properties[propName].map((value, index) => (
                      <li key={index}>
                        {value}
                        <button
                          onClick={() => removePropertyValue(propName, value)}
                          className="ml-2 text-red-600 hover:underline"
                        >
                          Remove Value
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No properties available</p>
        )}      
      </div>
    </div>
  );
}
