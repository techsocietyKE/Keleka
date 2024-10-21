import { useState } from "react";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function MealForm({
  _id,
  name: existingName,
  description: existingDescription,
  price: existingPrice = [],  // Initialize prices to an empty array if undefined
  image: existingImages,
  category: existingCategory = [], // Initialize category as an array for multiple selections
  stockStatus: existingStockStatus = "inStock", // Default stock status
}) {
  const { data: session } = useSession();
  const router = useRouter();

  // Initialize form states
  const [name, setName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [priceInput, setPriceInput] = useState(""); // Input field for adding a price
  const [prices, setPrices] = useState(existingPrice || []); // Array to hold price values
  const [image, setImage] = useState(existingImages || "");
  const [category, setCategory] = useState(existingCategory || []); // Change to an array to hold selected categories
  const [stockStatus, setStockStatus] = useState(existingStockStatus); // State for stock status
  const [isUploading, setIsUploading] = useState(false);

  // Save Meal Handler
  async function saveMeal(ev) {
    ev.preventDefault();
    const data = {
      name,
      description,
      prices,
      image,
      category, 
      stockStatus, 
      createdBy: session?.user?.firstname,
    };

    // Call API for update or create meal
    if (_id) {
      await axios.put("/api/meals", { ...data, _id });
    } else {
      await axios.post("/api/meals", data);
    }
    router.push("/meals");
  }

  // Upload image handler
  async function uploadImage(ev) {
    const file = ev.target?.files[0];
    setIsUploading(true);
    if (file) {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const uploadedImage = await res.json();
      setImage(uploadedImage[0]);
      setIsUploading(false);
    }
  }

  // Add Price to the list
  function addPrice() {
    if (priceInput && !isNaN(priceInput)) {
      setPrices([...prices, parseFloat(priceInput)]); // Add new price to array
      setPriceInput(""); // Clear input field
    }
  }

  // Remove price from the list
  function removePrice(index) {
    const updatedPrices = prices.filter((_, i) => i !== index); // Remove price by index
    setPrices(updatedPrices);
  }

  // Handle category selection via checkboxes
  function handleCategoryChange(ev) {
    const selectedCategory = ev.target.value;
    setCategory(prevCategory =>
      prevCategory.includes(selectedCategory)
        ? prevCategory.filter(c => c !== selectedCategory) // Remove if already selected
        : [...prevCategory, selectedCategory] // Add if not selected
    );
  }

  // Handle stock status change
  function handleStockChange(ev) {
    setStockStatus(ev.target.value);
  }

  return (
    <form onSubmit={saveMeal} className="p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Meal Form</h2>

      <label className="block text-gray-700 mb-2">Meal Name</label>
      <input
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none "
        type="text"
        placeholder="Meal name"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />

      <label className="block text-gray-700 mb-2">Description</label>
      <textarea
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none "
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
        {isUploading && <Spinner />}
        {!image && (
          <label className="w-24 h-24 flex items-center justify-center text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
            <span>Upload</span>
            <input onChange={uploadImage} type="file" className="hidden" />
          </label>
        )}
      </div>

      {/* Price Input Section */}
      <label className="block text-gray-700 mb-2">Add Prices (in Ksh)</label>
      <input
        className="w-full border border-gray-300 rounded-lg p-2 mb-2 outline-none"
        type="number"
        placeholder="Add price"
        value={priceInput}
        onChange={(ev) => setPriceInput(ev.target.value)}
      />
      <button
        type="button"
        onClick={addPrice}
        className="bg-green-600 text-white rounded-lg py-1 px-4 mb-4"
      >
        Add Price
      </button>

      {/* Display and Remove Prices */}
      {prices.length > 0 && (
        <ul className="list-disc pl-5">
          {prices.map((price, index) => (
            <li key={index}>
              {price} Ksh
              <button
                type="button"
                onClick={() => removePrice(index)}
                className="ml-4 text-red-600 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Category Selection with Checkboxes */}
      <label className="block text-gray-700 mb-2">Select Categories</label>
      <div className="mb-4">
        <label className="inline-flex items-center mr-4">
          <input
            type="checkbox"
            value="Breakfast"
            checked={category.includes("Breakfast")}
            onChange={handleCategoryChange}
            className="form-checkbox"
          />
          <span className="ml-2">Breakfast</span>
        </label>
        <label className="inline-flex items-center mr-4">
          <input
            type="checkbox"
            value="Lunch"
            checked={category.includes("Lunch")}
            onChange={handleCategoryChange}
            className="form-checkbox"
          />
          <span className="ml-2">Lunch</span>
        </label>
        <label className="inline-flex items-center mr-4">
          <input
            type="checkbox"
            value="Supper"
            checked={category.includes("Supper")}
            onChange={handleCategoryChange}
            className="form-checkbox"
          />
          <span className="ml-2">Supper</span>
        </label>
      </div>

      {/* Stock Status Selection */}
      <label className="block text-gray-700 mb-2">Stock Status</label>
      <select
        value={stockStatus}
        onChange={handleStockChange}
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none"
      >
        <option value="inStock">In Stock</option>
        <option value="outOfStock">Out of Stock</option>
      </select>

      <button
        type="submit"
        className="w-full bg-primary text-white rounded-lg py-2 mt-4  transition"
      >
        Save
      </button>
    </form>
  );
}
