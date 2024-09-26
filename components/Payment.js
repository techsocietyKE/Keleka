import React, { useContext, useState, useEffect } from 'react';
import { Button, Input, Radio, RadioGroup, Stack, Box, Text } from '@chakra-ui/react';
import Header from '@/components/Header';
import withAuth from '@/utils/withAuth';
import { CartContext } from '@/components/CartContext';
import Swal from 'sweetalert2';

const Payment = () => {
  const { cartBooks } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [county, setCounty] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [message, setMessage] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total amount from cartBooks
  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      cartBooks.forEach(book => {
        total += book.price;
      });
      setTotalAmount(total);
    };
    calculateTotal();
  }, [cartBooks]);
  console.log(cartBooks)

  const handleCheckout = async () => {
    // Prepare the checkout data
    const checkoutDetails = {
      name,
      email,
      phoneNumber,
      county,
      city,
      street,
      cartBooks
    };
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutDetails),
      });

      if (response.ok) {
        Swal.fire('Success', 'Your order has been placed!', 'success');
      } else {
        throw new Error('Checkout failed');
      }
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/initiate?phoneNumber=${phoneNumber}&amount=${totalAmount}&account=${account}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Payment initiated: ${result.ResponseDescription}`);
      } else {
        const error = await response.json();
        setMessage(`Payment initiation failed: ${error.errorMessage}`);
      }
    } catch (error) {
      setMessage(`Payment initiation error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="bg-[#201F31] flex flex-col md:flex-row items-center gap-3">
        <div className="bg-[#201F31] min-h-screen flex items-center justify-start basis-1/2 mt-12">
          <Box bg="gray.800" p={8} borderRadius="md" boxShadow="lg" maxW="lg" width="100%">
            <Text fontSize="2xl" color="white" mb={6} textAlign="center">
              Your Checkout Details
            </Text>
            <div className="grid grid-cols-2 gap-2">
              {/* Checkout form fields */}
              <InputField label="Full Name" value={name} onChange={setName} />
              <InputField label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} />
              <InputField label="County" value={county} onChange={setCounty} />
              <InputField label="City" value={city} onChange={setCity} />
              <InputField label="Street" value={street} onChange={setStreet} />
            </div>
          </Box>
        </div>
        <div className="bg-[#201F31] min-h-screen flex items-center justify-start basis-1/2 mt-12">
          <Box bg="gray.800" p={8} borderRadius="md" boxShadow="lg" maxW="lg" width="100%">
            <Text fontSize="2xl" color="white" mb={6} textAlign="center">
              Payment Options
            </Text>
            <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
              <Stack spacing={4}>
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
                <Box mt={6}>
                  <Input variant="outline" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} mb={4} />
                  <Input variant="outline" placeholder="Amount" type="number" value={totalAmount} readOnly mb={4} />
                  <Input variant="outline" placeholder="Account" value={account} onChange={(e) => setAccount(e.target.value)} mb={4} />
                </Box>
                <Button colorScheme="green" type="submit" width="full">
                  Pay
                </Button>
              </form>
            )}

            {paymentMethod === 'paybill' && (
              <Box mt={6}>
                <Text color="white" mb={4}>
                  Go to Lipa Na Mpesa and use till number 251907.
                </Text>
              </Box>
            )}

            {paymentMethod === 'cod' && (
              <Box mt={6}>
                <Text color="white" mb={4}>
                  Your order will be paid on delivery.
                </Text>
              </Box>
            )}

            <Button colorScheme="blue" mt={6} width="full" onClick={handleCheckout}>
              Complete Checkout
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

// Reusable input field component
const InputField = ({ label, value, onChange }) => (
  <div className="flex-col">
    <label className="text-gray-200 text-xl">{label}</label>
    <Input variant="outline" placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} className="my-4" />
  </div>
);

export default withAuth(Payment);
