import { CartContext } from "@/components/CartContext";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Book } from "@/models/Book";
import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import { HiShoppingCart } from "react-icons/hi";

export default function BookPage({ book }) {
    const {addBook} = useContext(CartContext);

  
  return (
 <div className="bg-[#201F31]">
    <Header/>
      <div className="flex items-center p-2 justify-start h-screen mx-auto">
        <div className=" shadow-sm md:p-5 md:w-[1000px] ">
        <img src={book.images[0]} alt={book.title} className="w-full md:w-[500px] h-[300px] rounded-lg shadow-md object-cover mb-4"/>
        <h1 className="md:text-2xl text-lg tracking-wider font-bold mb-4 text-gray-200">{book.title}</h1>
        <p className="mb-4 text-gray-300">{book.description}</p>
        <p className="mb-4 text-green-400">by {book.author}</p>
      <div className='flex items-center justify-start mt-1 pr-1 pl-1'>
                <h1 className="text-lg text-gray-100 mr-8 font-semibold">Ksh {book.price.toLocaleString()}</h1>
                <Button
                  type="button"
                  rightIcon={<HiShoppingCart />}
                  colorScheme="green"
                  variant="solid"
                  onClick={() => addBook(book._id)}
                >
                  Purchase
                </Button>
        </div>
        </div>
        
   </div>
 </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  await mongooseConnect();

  const book = await Book.findById(id);
  
  return {
    props: {
      book: JSON.parse(JSON.stringify(book)),
    },
  };
}
