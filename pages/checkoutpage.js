import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Header from "../components/Header";
import { Button, Input, Box, Text, RadioGroup, Stack, Radio, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const { cartBooks } = useContext(CartContext);
  const [books, setBooks] = useState([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

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
        text: 'Please wait while we process your Order.',
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
          name, phoneNumber, county, city, street, total,cartBooks,paymentMethod, paid: true, Mpesa: true,
          userId: session?.user?.id,
        });
  
        console.log('Payment Success:', result);
        Swal.fire({
          icon: 'success',
          title: 'Order Successful!',
          timer: 2000,
          showConfirmButton: false,
          position: 'top',
        });
      } else {
        const error = await response.json();
        console.log('Payment Error:', error);
  
        // Save order but mark payment as false
        await saveOrder({ 
          name, phoneNumber, county, city, street, total,cartBooks,paymentMethod, paid: false, Mpesa: false,
          userId: session?.user?.id,
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
      await saveOrder({ 
        name, phoneNumber, county, city, street, total,cartBooks,paymentMethod,
         paid: false, Mpesa: false,userId: session?.user?.id,
      });
  
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while processing your Order.',
        toast: true,
        position: 'top',
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

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
    <div className="max-w-6xl mx-auto  bg-gray-100 items-center justify-center py-3 flex flex-col md:flex-row mt-40 gap-9">
      <Header />
      
      <div className="flex flex-col items-center justify-center ">
        <span className="flex flex-col gap-2 items-center justify-center">
        <Text fontSize="2xl" fontWeight="bold" mb={1}>Books You Bought</Text>
        <Text fontSize="xl" fontWeight="bold" color="green.500">Total: Ksh {total.toFixed(2)}</Text>
        </span>
      
        <Box mb={6} className="max-h-[500px] w-full overflow-y-auto  bg-white shadow-md rounded-md">
          
          {books.length > 0 ? (
            books.map(book => (
              <Box key={book._id} px={8} py={4} bg="white" shadow="md" borderRadius="md" mb={4}>
                <Text fontSize="lg" fontWeight="bold">{book.title}</Text>
                <Text>Price: Ksh {book.price}</Text>
                <Text>Total: Ksh {(book.price * (book.quantity || 1)).toFixed(2)}</Text>
              </Box>
            ))
          ) : (
            <Text>No books in your cart.</Text>
          )}
          
        </Box>
      </div>

      <Box className="shadow-lg p-6 bg-white rounded-md">
       

        <Text fontSize="2xl" fontWeight="bold" color="green.500" mt={6} mb={2}>Payment Information</Text>
        <Text fontSize="lg" color="gray.700" mb={2}>Choose a Payment Method</Text>
        <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
          <Stack spacing={4} direction='row'>
            <Radio value="mpesa" colorScheme="green">M-Pesa</Radio>
            <Radio value="cod" colorScheme="green">Cash on Delivery</Radio>
          </Stack>
        </RadioGroup>

        {/* M-Pesa Payment Form */}
        {paymentMethod === 'mpesa' && (
          <form onSubmit={handleMpesaPayment} className="my-6 border p-4 rounded-md bg-gray-50">
            <Text textAlign="center" fontSize="lg" fontWeight="bold" color="green.500 " className="text-sm ">Pay with Mpesa</Text>
            <Text color="gray.700">Amount: Ksh {total.toFixed(2)}</Text>
            <Input variant="outline" placeholder="Mpesa Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} mb={4} />
            <Button colorScheme="green" type="submit" width="full" isDisabled={loading}>
              {loading ? "Processing..." : "Pay and Finish Checkout"}
            </Button>
          </form>
        )}

        {paymentMethod === 'cod' && (
          <Box mt={6}>
            <Text fontSize="2xl" fontWeight="bold" color="green.500" mb={4}>Checkout Information</Text>
        <Box mb={5} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input variant='outline' placeholder='Enter Your Name' value={name} onChange={ev => setName(ev.target.value)} />
          <Input variant='outline' placeholder='Enter Your Phone Number' value={contact} onChange={ev => setContact(ev.target.value)} />
          <Input variant='outline' placeholder='County' value={county} onChange={ev => setCounty(ev.target.value)} />
          <Input variant='outline' placeholder='Town' value={city} onChange={ev => setCity(ev.target.value)} />
          <Input variant='outline' placeholder='Street' value={street} onChange={ev => setStreet(ev.target.value)} />
        </Box>
            <Button colorScheme="green" width="full" isDisabled={loading} onClick={handleMpesaPayment}>
              {loading ? "Processing..." : "Finish Checkout"}
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default CheckoutPage;
