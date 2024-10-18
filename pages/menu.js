import Header from '@/components/Header';
import React, { useState, useEffect } from 'react';

export default function MenuItems() {
  const [breakfast, setBreakfast] = useState([]);
  const [lunch, setLunch] = useState([]);
  const [evening, setEvening] = useState([]);

  useEffect(() => {
    
    fetch('/api/menu-categories?category=breakfast')
      .then((res) => res.json())
      .then((data) => setBreakfast(data));

    
    fetch('/api/menu-categories?category=lunch')
      .then((res) => res.json())
      .then((data) => setLunch(data));

    
    fetch('/api/menu-categories?category=evening')
      .then((res) => res.json())
      .then((data) => setEvening(data));
  }, []);

  return (
    <div>
      <Header />
      <section className='mt-20 px-5'>
        <h1 className='text-4xl font-bold text-center mb-10'>Our Menu</h1>

        {/* Breakfast Category */}
        <div className='mb-10'>
          <h2 className='text-3xl font-semibold mb-4'>Breakfast</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {breakfast.length > 0 ? (
              breakfast.map((meal) => (
                <MealItem key={meal._id} {...meal} />
              ))
            ) : (
              <p>No breakfast items available</p>
            )}
          </div>
        </div>

        {/* Lunch Category */}
        <div className='mb-10'>
          <h2 className='text-3xl font-semibold mb-4'>Lunch</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {lunch.length > 0 ? (
              lunch.map((meal) => (
                <MealItem key={meal._id} {...meal} />
              ))
            ) : (
              <p>No lunch items available</p>
            )}
          </div>
        </div>

        {/* Evening Category */}
        <div className='mb-10'>
          <h2 className='text-3xl font-semibold mb-4'>Evening</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {evening.length > 0 ? (
              evening.map((meal) => (
                <MealItem key={meal._id} {...meal} />
              ))
            ) : (
              <p>No evening items available</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const MealItem = ({ name, description, image }) => {
  return (
    <div className='bg-gray-200 p-4 rounded-lg text-center group hover:bg-white hover:shadow-md
     hover:shadow-black/25 transition-all'>
  
        <img src={image} alt={name} className='w-full h-48 object-cover rounded-md' />
    
      <h3 className='font-semibold text-xl mt-3'>{name}</h3>
      <p className='text-gray-600 mt-2 text-sm'>{description}</p>
    </div>
  );
};
