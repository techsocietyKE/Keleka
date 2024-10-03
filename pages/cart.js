import Header from "../components/Header";
import { Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useToast, Box } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cartBooks, addBook, removeBook } = useContext(CartContext);
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (cartBooks.length > 0) {
      axios.post('/api/cart', { ids: cartBooks })
        .then(response => {
          setBooks(response.data);
        });
    } else {
      setBooks([]);
    }
  }, [cartBooks]);

  // Calculate total price
  useEffect(() => {
    let totalPrice = 0;
    for (const bookId of cartBooks) {
      const price = books.find(p => p._id === bookId)?.price || 0;
      totalPrice += price;
    }
    setTotal(totalPrice);
  }, [cartBooks, books]);

  return (
    <div className="bg-[#201F31] min-h-screen md:mt-20">
      <Header />
      <div className="md:px-4 py-6 items-center justify-center">
        <div className="shadow-lg md:p-6 md:flex flex-col md:items-center md:justify-center px-2 mt-12 bg-[#201F31] text-gray-100 rounded-md">
          {!cartBooks.length && <h2 className="text-center text-xl text-gray-300">Your cart is empty</h2>}
          {books.length > 0 && (
            <div>
              <h2 className="text-xl mb-4">Cart</h2>
              {/* Scrollable container for the cart items */}
              <Box maxHeight="400px" overflowY="auto" className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th><h1 className="text-gray-300">Book</h1></Th>
                        <Th><h1 className="text-gray-300">Quantity</h1></Th>
                        <Th isNumeric><h1 className="text-gray-300">Price</h1></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {books.map(book => (
                        <Tr key={book._id}>
                          <Td>
                            <div className="flex flex-col items-start">
                              <img src={book.images[0]} alt="img" className="h-[90px] w-[120px] object-cover rounded-xl shadow-sm" />
                              <h1 className="text-gray-300 my-1 font-semibold text-lg">{book.title}</h1>
                            </div>
                          </Td>
                          <Td>
                            <div className="flex items-center">
                              <Button size="sm" onClick={() => removeBook(book._id)}>-</Button>
                              <span className="mx-3">{cartBooks.filter(id => id === book._id).length}</span>
                              <Button size="sm" onClick={() => addBook(book._id)}>+</Button>
                            </div>
                          </Td>
                          <Td isNumeric>
                            <h1 className="text-gray-300 font-semibold">
                              Ksh {(cartBooks.filter(id => id === book._id).length * book.price).toLocaleString()}
                            </h1>
                          </Td>
                        </Tr>
                      ))}
                      <Tr>
                        <Td></Td>
                        <Td>
                          <h1 className="font-semibold text-lg">Total</h1>
                        </Td>
                        <Td isNumeric>
                          <h1 className="text-gray-300 font-semibold text-lg">
                            Ksh {total.toLocaleString()}
                          </h1>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </div>
          )}
          <div className="my-5">
            <Button width="full" onClick={() => router.push('/checkoutpage')}>Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
