import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

const ViewBook = () => {
  const router = useRouter();
  const { id } = router.query; // Get the book ID from the URL
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`/api/books/${id}`).then((response) => {
        setBook(response.data);
      });
    }
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{book.title}</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Author: {book.author}</h2>
          <p className="text-gray-700 mt-2">Description: {book.description}</p>
          <p className="text-gray-700 mt-2">Price: Ksh {book.price}</p>
          <p className="text-gray-700 mt-2">Genre: {book.genre.genrename}</p>
          <p className="text-gray-700 mt-2">Created by: {book.createdBy}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {book.images && book.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={book.title}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back
        </button>
      </div>
    </Layout>
  );
};

export default ViewBook;
