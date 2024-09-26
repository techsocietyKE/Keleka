import Header from "../components/Header";
import { Button, Input, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useToast, RadioGroup,
  Stack,Radio,Box,Text
 } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";

const CartPage = ()=> {
  const { cartBooks, addBook, removeBook } = useContext(CartContext);
  const [books, setBooks] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contact, setContact] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
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

  function moreOfThisBook(id) {
    addBook(id);
  }

  function lessOfThisBook(id) {
    removeBook(id);
  }

 

  let total = 0;
  for (const bookId of cartBooks) {
    const price = books.find(p => p._id === bookId)?.price || 0;
    total += price;
  }
  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading state to true
    
    try {
      // Show loading message
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we process your payment.',
        timer: 8000,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();  // Show loading indicator
        },
      });
  
      // Trigger Mpesa payment API call
      const response = await fetch(`/api/mpesa?phoneNumber=${phoneNumber}&amount=${total}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
  
        // Update order in the database with payment success
        await saveOrder({ 
          name, phoneNumber, county, city, street, total,cartBooks,paymentMethod, paid: true, Mpesa: true 
        });
  
        console.log('Payment Success:', result);
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          timer: 2000,
          showConfirmButton: false,
          position: 'center',
        });
      } else {
        const error = await response.json();
        console.log('Payment Error:', error);
  
        // Save order but mark payment as false
        await saveOrder({ 
          name, phoneNumber, county, city, street, total,cartBooks,paymentMethod, paid: false, Mpesa: false 
        });
  
        Swal.fire({
          icon: 'success',
          title: 'success',
          toast: true,
          position: 'top',
          timer: 3000,
          showConfirmButton: false,
        });
      }
      router.push('/order-success')
    } catch (error) {
      console.error('Error during payment initiation:', error);
  
      // Save order with payment as false
      await saveOrder({ 
        name, phoneNumber, county, city, street, total,cartBooks,paymentMethod,
         paid: false, Mpesa: false 
      });
  
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while processing your payment.',
        toast: true,
        position: 'top',
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);  // Reset loading state
    }
  };
  
  // Function to save the order to the database
  const saveOrder = async (orderData) => {
    try {
      const res = await axios.post('/api/checkout', orderData,paymentMethod);
      if (res.data.success) {
        console.log('Order saved successfully');
      } else {
        console.log('Failed to save order');
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };
  

  return (
    <div className="bg-[#201F31] min-h-screen md:mt-20">
      <Header />
      <div className="grid md:grid-cols-2 px-4 gap-5 py-6">
        {/* Cart Section */}
        <div className="shadow-lg p-6 bg-[#201F31] text-gray-100 rounded-md">
          {!cartBooks?.length && <h2 className="text-center text-xl text-gray-600">Your cart is empty</h2>}
          {books?.length > 0 && (
            <div>
              <h2 className="text-xl mb-4">Cart</h2>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th><h1 className="text-gray-600">Book</h1></Th>
                      <Th><h1 className="text-gray-600">Quantity</h1></Th>
                      <Th isNumeric><h1 className="text-gray-600">Price</h1></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {books.map(book => (
                      <Tr key={book._id}>
                        <Td>
                          <div className="flex flex-col items-start">
                            <img src={book.images[0]} alt="img" className="h-[90px] w-[120px] object-cover rounded-xl shadow-sm" />
                            <h1 className="text-gray-600 my-1 font-semibold text-lg">{book.title}</h1>
                          </div>
                        </Td>
                        <Td>
                          <div className="flex items-center">
                            <Button size="sm" onClick={() => lessOfThisBook(book._id)}>-</Button>
                            <span className="mx-3">{cartBooks.filter(id => id === book._id).length}</span>
                            <Button size="sm" onClick={() => moreOfThisBook(book._id)}>+</Button>
                          </div>
                        </Td>
                        <Td isNumeric>
                          <h1 className="text-gray-600 font-semibold">
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
                        <h1 className="text-gray-600 font-semibold text-lg">
                          Ksh {total.toLocaleString()}
                        </h1>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="shadow-lg p-6 bg-[#201F31] rounded-md">
        <div>
        <h1 className="text-xl text-green-500">Checkout Information</h1>
          <div className=" grid grid-cols-2 gap-2 ">
            <div className='flex-col'>
              <Input variant='outline' 
              placeholder='Enter Your Name' 
              value={name} 
              onChange={ev => setName(ev.target.value)} 
              className="my-2" />
            </div>
            <div className='flex-col'>
              <Input variant='outline' 
              placeholder='Enter Your Phone Number' 
              value={contact} 
              onChange={ev => setContact(ev.target.value)} 
              className="my-2" />
            </div>
            <div className='flex-col'>
              <Input variant='outline' 
              placeholder='county' 
              value={county} 
              onChange={ev => setCounty(ev.target.value)} 
              className="my-2" />
            </div>
            <div className='flex-col'> 
              <Input variant='outline' 
              placeholder='town near you' 
              value={city} 
              onChange={ev => setCity(ev.target.value)} 
              className="my-2" />
            </div>
            <div className='flex-col'>
              <Input variant='outline' 
              placeholder='street' 
              value={street} 
              onChange={ev => setStreet(ev.target.value)} 
              className="my-2" />
            </div>
                
          </div>
          {/* <Button onClick={goToCheckoutPage} colorScheme="green" size="lg">Continue to Payment</Button> */}
        </div>
        <div>
          <h1 className="text-xl text-green-400">Payment Information</h1>
          <h1 className="text-green-500 my-2 underline">Choose a Payment Method</h1>
          <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
              <Stack spacing={4} direction='row'>
                <Radio value="mpesa" colorScheme="green">
                  <h1 className="text-gray-200">M-Pesa</h1>
                </Radio>
                <Radio value="paybill" colorScheme="green">
                  <h1 className="text-gray-200">Paybill</h1>
                </Radio>
                <Radio value="cod" colorScheme="green">
                  <h1 className="text-gray-200">Cash on Delivery</h1>
                </Radio>
              </Stack>
            </RadioGroup>
            {paymentMethod === 'mpesa' && (
              <form onSubmit={handleMpesaPayment} className="my-7 border p-4 rounded-md text-gray-200">
                <h1 className="text-gray-200 text-center text-lg tracking-wider font-semibold">Pay with Mpesa</h1>
                <h1 className="text-green-400  text-md  font-semibold">Enter Mpesa Number to pay with</h1>
                <h1 className="text-green-400  text-md  font-semibold">Amount: Ksh {total}</h1>
                <Box mt={6}>
                  <Input variant="outline" 
                  placeholder="Phone Number" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)}
                   mb={4}  
                  />
                
                </Box>
                <Button 
    colorScheme="green" 
    type="submit" 
    width="full" 
    isDisabled={loading}  // Disable the button while loading
  >
    {loading ? "Processing..." : "Pay and Finish Checkout"}
  </Button>
              </form>
            )}

            {paymentMethod === 'paybill' && (
              <Box mt={6}>
                <Text color="white" mb={4}>
                  <h1 className="text-green-500 text-lg tracking-wider font-semibold">Amount to pay: {total.toLocaleString()}</h1>
                  Go to Lipa Na Mpesa and use till number 251907 .

                  <Button 
    colorScheme="green" 
    width="full" 
    isDisabled={loading}
    onClick={handleMpesaPayment}  // Disable the button while loading
  >
    {loading ? "Processing..." : "Finish Checkout"}
    </Button>
                  
                </Text>
              </Box>
            )}

            {paymentMethod === 'cod' && (
              <Box mt={6}>
                <Text color="white" mb={4}>
                  Your order will be paid on delivery.
                </Text>
                <Button 
    colorScheme="green" 
    width="full" 
    isDisabled={loading}
    onClick={handleMpesaPayment}  // Disable the button while loading
  >
    {loading ? "Processing..." : "Finish Checkout"}
    </Button> 
              </Box>
            )}
        </div>
        </div>
      </div>
    </div>
  );
}
export default withAuth(CartPage)