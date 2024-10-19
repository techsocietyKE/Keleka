import React, { useContext, useState } from 'react';
import { CartContext } from './AppProvider';
import Swal from 'sweetalert2';
import Image from 'next/image';

const MenuItem = (menuItem) => {
  const { image, name, description, prices } = menuItem;
  const [showPopup, setShowPopUp] = useState(false);
  const { addToCart } = useContext(CartContext);
  const [selectedPrices, setSelectedPrices] = useState([]);

  function handleCheckboxChange(price) {
    if (selectedPrices.includes(price)) {
      setSelectedPrices(selectedPrices.filter((p) => p !== price));
    } else {
      setSelectedPrices([...selectedPrices, price]);
    }
  }

  const totalPrice = selectedPrices.reduce((total, price) => total + price, 0);

  function handleAddToCartButtonClick() {
    if (prices.length === 0) {
      addToCart(menuItem);
      Swal.fire({
        text: 'Added to cart',
        icon: 'success',
        position: 'top',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } else {
      setShowPopUp(true);
    }
  }

  function handleAddToCartFromPopup() {
    if (selectedPrices.length > 0) {
      addToCart({ ...menuItem, selectedPrices });
      setShowPopUp(false);
      Swal.fire({
        text: `Added to cart Ksh ${totalPrice}`,
        icon: 'success',
        position: 'top',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }

  return (
    <>
     {showPopup && (
  <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'>
    <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto mx-auto'>
      <button
        className='font-extrabold text-gray-500 hover:text-gray-700 mb-4'
        onClick={() => setShowPopUp(false)}
      >
        ✕
      </button>

      <Image
        src={image}
        alt={name}
        width={200}
        height={200}
        className='mx-auto rounded-lg shadow-md mb-4'
      />

      <h2 className='text-xl font-bold text-center my-3'>{name}</h2>
      <p className='text-center text-gray-500 text-sm mb-4'>{description}</p>

      {prices?.length > 0 && (
        <div>
          <h3 className='text-lg font-semibold text-center mb-2'>Select Your Price</h3>
          <div className='space-y-2'>
            {prices.map((price, index) => (
              <label
                key={index}
                className='flex items-center justify-between bg-gray-100 p-3 rounded-md shadow-sm hover:bg-gray-200 transition-colors'
              >
                <span>Ksh {price}</span>
                <input
                  type='checkbox'
                  name='price'
                  value={price}
                  onChange={() => handleCheckboxChange(price)}
                  checked={selectedPrices.includes(price)}
                />
              </label>
            ))}
          </div>
        </div>
      )}

      <div className='mt-6'>
        <button
          className='w-full bg-primary py-3 font-semibold text-white rounded-md hover:bg-primary-dark transition-colors'
          onClick={handleAddToCartFromPopup}
        >
          Add to cart {totalPrice > 0 ? `Ksh ${totalPrice}` : ''}
        </button>
      </div>
    </div>
  </div>
)}


      {/* MenuItem Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 p-4">
        <Image
          src={image}
          alt={name}
          width={400}
          height={300}
          className="rounded-lg object-cover w-full h-40"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">{name}</h3>
          <p className="text-sm text-gray-500 mb-4">{description}</p>
          {prices?.length > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">From Ksh {prices[0]}</span>
              <button
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                onClick={handleAddToCartButtonClick}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuItem;
