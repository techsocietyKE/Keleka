import { CartContext } from "@/components/AppProvider";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Meal } from "@/models/Meal";
import { useContext, useState } from "react";
import { HiShoppingCart } from "react-icons/hi";

export default function MealPage({ meal }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white flex items-center">
      <Header />
      <div className="flex items-center p-2 justify-start mt-28 h-screen mx-auto">
        <div className="shadow-sm md:p-5 md:w-[1000px]">
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full md:w-[500px] h-[300px] rounded-lg shadow-md object-cover mb-4"
          />
          <h1 className="md:text-2xl text-lg tracking-wider font-bold mb-4 text-gray-900">
            {meal.name}
          </h1>
          <p className="mb-4 text-gray-700">{meal.description}</p>

        
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Select Price (Ksh):</h2>
            <select
              className="mb-4 p-2 border rounded-lg"
            >
              {meal.prices.map((price, index) => (
                <option key={index} value={price}>
                  Ksh {price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-start mt-1 pr-1 pl-1">
            <button
              type="button"

              className="bg-primary py-1 text-white text-lg px-8 rounded-md flex gap-2 items-center"
            >
              <HiShoppingCart />
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  await mongooseConnect();

  const meal = await Meal.findById(id);

  return {
    props: {
      meal: JSON.parse(JSON.stringify(meal)),
    },
  };
}
