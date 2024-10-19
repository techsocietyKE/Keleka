import { useState, useEffect, useContext } from "react";
import Slider from "react-slick";
import { Button } from '@chakra-ui/react';
import { MdShoppingCart } from "react-icons/md";
import { CartContext } from "./AppProvider";
import axios from "axios";

export default function Featured() {
  const { addProduct } = useContext(CartContext);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  };

  // Fetch meals from the API
  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await axios.get('/api/menu-items'); // API endpoint for fetching meals
        setMeals(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meals:", error);
        setLoading(false);
      }
    }
    fetchMeals();
  }, []);

  function addFeaturedToCart(mealId) {
    addProduct(mealId);
  }

  if (loading) {
    return <div className="text-center mt-10">Loading meals...</div>;
  }

  return (
    <div className="w-full mt-[75px] md:mt-[80px]">
      {meals.length > 0 ? (
        <Slider {...settings}>
          {meals.slice(0, 4).map((meal) => (
            <div key={meal._id} className="md:p-8 p-2 py-3">
              <div className="flex flex-col md:flex-row justify-center items-center">
                <div className="md:w-1/2 px-8 py-12 text-center md:text-left">
                  <h1 className="text-4xl font-bold mb-4 text-gray-700">{meal.name}</h1>
                  <p className="mb-4 text-gray-600 text-lg">{meal.description}</p>
            
                </div>
                <div className="md:w-1/2">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-full h-[300px] max-w-[400px] rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="text-center mt-10">No meals available.</div>
      )}
    </div>
  );
}
