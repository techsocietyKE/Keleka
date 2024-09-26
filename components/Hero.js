import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { Button } from '@chakra-ui/react';
import { MdShoppingCart } from "react-icons/md";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Import Swiper styles

export default function Hero() {
  const { addBook } = useContext(CartContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch the books from MongoDB when the component loads
    const fetchBooks = async () => {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
      console.log(data)
    };
    fetchBooks();
  }, []);

  function addFeaturedToCart(bookId) {
    addBook(bookId);
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 border border-slate-800 shadow-sm m-6 rounded-lg">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
      >
        {books.map((book) => (
          <SwiperSlide key={book._id}>
            <div className="flex flex-col md:flex-row justify-center items-center p-8">
              <div className="md:w-1/2 px-8 py-0">
                <h1 className="text-4xl font-bold mb-4 text-gray-50">{book.title}</h1>
                <p className="mb-4 text-gray-200 text-lg">{book.description}</p>
                <div className="flex flex-col md:flex-row gap-2 text-gray-200">
                  <Button
                    onClick={() => addFeaturedToCart(book._id)}
                    rightIcon={<MdShoppingCart />}
                    colorScheme='green'
                    variant='solid'
                  >
                    Purchase
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  src={book.image} // Image URL stored in MongoDB
                  alt={book.title}
                  className="w-full h-auto md:h-full"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
