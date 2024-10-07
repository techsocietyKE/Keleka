import React, { useContext, useEffect, useState } from 'react';
import Header from '@/components/Header';
import axios from 'axios'; // To fetch data from your API
import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import { HiShoppingCart } from 'react-icons/hi';
import { CartContext } from '@/components/CartContext';

const Categories = () => {
    const { addBook } = useContext(CartContext);
  const [documentaryBooks, setDocumentaryBooks] = useState([]);
  const [kidsBooks, setKidsBooks] = useState([]);
  const [mangaBooks, setMangaBooks] = useState([]);
  const [politicalBooks, setPoliticalBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const documentaryResponse = await axios.get('api/categories?genre=Documentary');
        setDocumentaryBooks(documentaryResponse.data);

        const kidsResponse = await axios.get('api/categories?genre=Kids');
        setKidsBooks(kidsResponse.data);

        const mangaResponse = await axios.get('api/categories?genre=Manga');
        setMangaBooks(mangaResponse.data);
        const politicalResponse = await axios.get('api/categories?genre=Political');
        setPoliticalBooks(politicalResponse.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const renderBooks = (books) => {
    return books.map(({ _id, images, title, author, price }) => (
      <div key={_id} className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <Link href={`/viewbook/${_id}`} className="w-full">
          {images && images.length > 0 ? (
            <img
              className="w-full h-[200px] object-cover rounded-t-lg"
              src={images[0]}
              alt="Book Image"
            />
          ) : (
            <div className="w-full h-[200px] flex items-center justify-center bg-slate-700 text-gray-400">
              No Image Available
            </div>
          )}
        </Link>

        <div className="mt-4 w-full text-center">
          <Link href={`/viewbook/${_id}`}>
            <h1 className="text-xl font-semibold text-gray-50 hover:text-indigo-400 transition-colors duration-200">
              {title}
            </h1>
          </Link>
          <p className="text-sm text-gray-400 mt-1">By {author}</p>
        </div>

        <div className="flex items-center justify-between w-full mt-4">
          <h1 className="text-lg font-bold text-green-400">Ksh {price}</h1>
          <Button
            rightIcon={<HiShoppingCart />}
            colorScheme="green"
            variant="solid"
            onClick={() => addBook(_id)}
            className="flex items-center"
          >
            Purchase
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <div className='bg-[#201F31] min-h-screen'>
      <Header />
      <div className='mt-20'>
        <h1 className='text-3xl ml-5 text-gray-200 tracking-widest font-semibold'>Categories</h1>
      </div>
      
      <div>
        <h1 className='text-xl ml-7 text-gray-300 tracking-wide font-semibold'>Documentary</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5'>
          {renderBooks(documentaryBooks)}
        </div>
      </div>

      <div>
        <h1 className='text-xl ml-7 text-gray-300 tracking-wide font-semibold'>Kids</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5'>
          {renderBooks(kidsBooks)}
        </div>
      </div>

      <div>
        <h1 className='text-xl ml-7 text-gray-300 tracking-wide font-semibold'>Manga</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5'>
          {renderBooks(mangaBooks)}
        </div>
      </div>

      <div>
        <h1 className='text-xl ml-7 text-gray-300 tracking-wide font-semibold'>Political</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5'>
          {renderBooks(politicalBooks)}
        </div>
      </div>

    </div>
  );
};

export default Categories;
