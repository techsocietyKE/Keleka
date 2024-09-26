
import { useContext } from "react";
import { CartContext } from "./CartContext";
import {Button} from '@chakra-ui/react'
import { MdShoppingCart } from "react-icons/md";
    export default function Featured({book}){
        const {addBook}= useContext(CartContext)
      function addFeaturedToCart(){
        addBook(book._id)
      }
    return(
        <div className=" bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 border border-slate-800 shadow-sm m-6 rounded-l-[400px]">
          <div className="flex flex-col md:flex-row justify-center items-center">
    
      <div className="md:w-1/2 px-8 py-0">
        <h1 className="text-4xl font-bold mb-4 text-gray-50">{book.title}</h1>
        <p className="mb-4 text-gray-200 text-lg">
         {book.description}
        </p>
        <div className="flex flex-col md:flex-row gap-2 text-gray-200">
          <Button  onClick={addFeaturedToCart} rightIcon={<MdShoppingCart />} colorScheme='green' variant='solid'>
           Purchase
          </Button>
    
        </div>
      </div>
      {/* Image Section */}
      <div className="md:w-1/2">
        <img
          src="https://res.cloudinary.com/drdaorvv1/image/upload/v1725462622/mdwbwskl8pldj2k3cly4.png"  // Replace with your image source
          alt="Book Image"
          className="w-full h-auto md:h-full"
        />
      </div>
    </div>

        </div>
    )
}