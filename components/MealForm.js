import { useState } from "react";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function MealForm({
  _id,
  name: existingName,
  description: existingDescription,
  price: existingPrice,
  images: existingImages, // Assuming this should now handle only one image
  properties: existingProperties,
}) {
  const { data: session } = useSession();
  const [name, setName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [image, setImage] = useState(existingImages?.[0] || ""); // Handle only one image
  const [isUploading, setIsUploading] = useState(false);
  const [properties, setProperties] = useState(existingProperties || {});
  const [propertyName, setPropertyName] = useState("");  // New property name
  const [propertyValue, setPropertyValue] = useState("");  // New property value
  const router = useRouter();

  async function saveMeal(ev) {
    ev.preventDefault();
    const data = {
      name,
      description,
      price,
      images: [image], // Send only one image in the array
      properties,  // Include the properties object
      createdBy: session?.user?.firstname,
    };
    if (_id) {
      await axios.put("/api/meals", { ...data, _id });
    } else {
      await axios.post("/api/meals", data);
    }
    router.push("/meals");
  }

  async function uploadImage(ev) {
    const file = ev.target?.files[0]; // Only allow one file
    setIsUploading(true);
    if (file) {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const uploadedImage = await res.json();
      setImage(uploadedImage[0]); // Set the single image
      setIsUploading(false);
    }
  }

  // Handle adding property values
  function addProperty() {
    if (propertyName && propertyValue) {
      const updatedValues = properties[propertyName] ? [...properties[propertyName], propertyValue] : [propertyValue];
      setProperties({
        ...properties,
        [propertyName]: updatedValues,
      });
      setPropertyName("");
      setPropertyValue("");
    }
  }

  // Remove a specific property value
  function removePropertyValue(propName, value) {
    const updatedValues = properties[propName]?.filter((val) => val !== value);
    setProperties({
      ...properties,
      [propName]: updatedValues.length ? updatedValues : undefined,  // Remove the property if no values are left
    });
  }

  // Remove the entire property
  function removeProperty(propName) {
    const updatedProperties = { ...properties };
    delete updatedProperties[propName];
    setProperties(updatedProperties);
  }

  return (
    <form onSubmit={saveMeal} className="p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Meal Form</h2>

      <label className="block text-gray-700 mb-2">Meal Name</label>
      <input
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500"
        type="text"
        placeholder="meal name"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />

      <label className="block text-gray-700 mb-2">Description</label>
      <textarea
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500"
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />

      <label className="block text-gray-700 mb-2">Cover Photo</label>
      <div className="flex flex-wrap gap-4 mb-4">
        {image && (
          <div className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
            <img
              src={image}
              alt="Uploaded Image"
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
        )}

        {isUploading && (
          <div className="h-24 w-24 flex items-center justify-center">
            <Spinner />
          </div>
        )}

        {!image && (
          <label className="w-24 h-24 flex items-center justify-center text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
            <span>Upload</span>
            <input onChange={uploadImage} type="file" className="hidden" />
          </label>
        )}
      </div>

      <label className="block text-gray-700 mb-2">Starting Price (in Ksh)</label>
      <input
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />

      {/* New Section for Adding Properties */}
      <h3 className="text-lg font-medium mb-2">Add Meal Properties</h3>

      <label className="block text-gray-700 mb-2">Property Name</label>
      <input
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500"
        type="text"
        placeholder="e.g. size, price"
        value={propertyName}
        onChange={(ev) => setPropertyName(ev.target.value)}
      />

      <label className="block text-gray-700 mb-2">Property Values</label>
      <input
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500"
        type="text"
        placeholder="Add value (e.g. Large, Medium)"
        value={propertyValue}
        onChange={(ev) => setPropertyValue(ev.target.value)}
      />

      <button type="button" onClick={addProperty} className="bg-green-600 text-white rounded-lg py-2 px-4 mb-4">
        Add Property
      </button>

      {/* Displaying Added Properties */}
      {Object.keys(properties).map((propName) => (
        <li key={propName} className="mb-2">
          <strong>{propName}:</strong>{" "}
          {Array.isArray(properties[propName]) && properties[propName].length > 0
            ? properties[propName].join(", ")
            : "No values"}
          <button
            onClick={() => removeProperty(propName)}
            className="ml-4 text-red-600 hover:underline"
          >
            Remove Property
          </button>
          {Array.isArray(properties[propName]) && properties[propName].length > 0 && (
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

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-lg py-2 mt-4 hover:bg-blue-700 transition"
      >
        Save
      </button>
    </form>
  );
}
