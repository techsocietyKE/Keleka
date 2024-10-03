import { Button } from "@chakra-ui/react";
import { HiShoppingCart } from "react-icons/hi";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import Link from "next/link";

export default function BookBox({ _id, title, author, price, images }) {
  const { addBook } = useContext(CartContext);
  const formattedPrice = price.toLocaleString();

  // Truncate the title to 3 words
  const truncateTitle = (title) => {
    const words = title.split(" ");
    return words.length > 3 ? words.slice(0, 3).join(" ") + "..." : title;
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300 ease-in-out">
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
            {truncateTitle(title)}
          </h1>
        </Link>
        <p className="text-sm text-gray-400 mt-1">By {author}</p>
      </div>

      <div className="flex items-center justify-between w-full mt-4">
        <h1 className="text-lg font-bold text-green-400">Ksh {formattedPrice}</h1>
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
  );
}
