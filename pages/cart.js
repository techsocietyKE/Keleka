import { CartContext } from '@/components/AppProvider';
import Header from '@/components/Header';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { FaTrashAlt } from "react-icons/fa";
import { Button, Input, Box, Text, RadioGroup, Stack, Radio, Flex, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CartPage = () => {
  const { data: session } = useSession();
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [popup, setPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const calculateTotal = (product) => {
    if (product.selectedPrices && product.selectedPrices.length > 0) {
      return product.selectedPrices.reduce((acc, price) => acc + Number(price), 0);
    }
    return Number(product.basePrice);  
  };

  const calculateGrandTotal = () => {
    return cartProducts.reduce((acc, product) => acc + calculateTotal(product), 0);
  };

  let grandTotal = calculateGrandTotal();

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    setLoading(true);  
    
    try {
      if (paymentMethod === 'mpesa') {
       
        Swal.fire({
          title: 'Processing...',
          text: 'Please Enter your Mpesa pin to finish the order.',
          timer: 15000,  
          timerProgressBar: true,
          toast: true,
          position: 'top-right', 
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const response = await fetch(`/api/mpesa?phoneNumber=${phoneNumber}&amount=${grandTotal}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          await saveOrder({
            grandTotal, cartProducts, paymentMethod, paid: true, Mpesa: true,
            userId: session?.user?.id, email: session?.user?.email,
            fullname:session?.user?.fullname,phoneNumber:session?.user?.phoneNumber,
          });
          console.log('Payment Success:', result);
        } else {
          const error = await response.json();
          console.log('Payment Error:', error);
          await saveOrder({
            grandTotal, cartProducts, paymentMethod, paid: false, Mpesa: false,
            userId: session?.user?.id, email: session?.user?.email,
            fullname:session?.user?.fullname,phoneNumber:session?.user?.phoneNumber,
          });
  
          Swal.fire({
            icon: 'error',
            title: 'Payment Failed',
            text: 'Please try again.',
            toast: true,
            position: 'top-right',
            timer: 3000,
            showConfirmButton: false,
          });
        }
  
      } else if (paymentMethod === 'cash') {
      t
        Swal.fire({
          title: 'Processing...',
          text: 'Please wait while we process your Order.',
          timer: 10000,  
          timerProgressBar: true,  
          toast: true,  
          position: 'top-right',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();  
          },
        });
  
       
        await saveOrder({
          grandTotal, cartProducts, paymentMethod, paid: false, Mpesa: false,
          userId: session?.user?.id, email: session?.user?.email,
          fullname:session?.user?.fullname,phoneNumber:session?.user?.phoneNumber,
          
        });
        
        console.log('cash Order processed successfully.');
      }
  
      setTimeout(() => {
        router.push('/profile');
      }, paymentMethod === 'mpesa' ? 15000 : 10000);  
    } catch (error) {
      console.error('Error during payment initiation:', error);
  
      await saveOrder({
        grandTotal, cartProducts, paymentMethod,
        paid: false, Mpesa: false, userId: session?.user?.id, email: session?.user?.email,
        fullname:session?.user?.fullname,phoneNumber:session?.user?.phoneNumber,
        
      });
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
        toast: true,
        position: 'top-right',
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false); 
    }
  };
  
  const handleCashPayment = async () => {
    setLoading(true);
  
    try {
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we process your Order.',
        timer: 10000,
        timerProgressBar: true,
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  
       await saveOrder({
        grandTotal,
        cartProducts,
        paymentMethod: 'cash',
        paid: false,  
        Mpesa: false,  
        userId: session?.user?.id,
        email: session?.user?.email,
        fullname: session?.user?.fullname,
        phoneNumber: session?.user?.phoneNumber,
      });
      
      console.log('cash Order processed successfully.');
      Swal.fire({
        icon: 'success',
        title: 'Order Placed',
        text: 'Your order has been placed successfully.',
        toast: true,
        position: 'top-right',
        timer: 3000,
        showConfirmButton: false,
      });

      router.push('/profile');
  
    } catch (error) {
      console.error('Error during cash order processing:', error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
        toast: true,
        position: 'top-right',
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveOrder = async (orderData) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();
      if (result.success) {
        console.log('Order saved successfully');
      } else {
        console.log('Failed to save order');
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };



  return (
    <div>
      <Header />
      <section className="mt-20  flex flex-col justify-center md:p-24 p-2">
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">Your Items to Checkout</Text>
        
        <div>
          {cartProducts?.length === 0 && <Text>No items in your cart</Text>}
          {cartProducts?.length > 0 && cartProducts.map((product, index) => (
            <Box key={product._id} border="1px" borderColor="gray.200" borderRadius="lg" p={4} mb={4}>
              <Flex align="center" gap={4}>
                <Box w="80px">
                  <Image width={240} height={240} src={product.image} className="rounded-lg" alt={product.name} />
                </Box>
                <Box flex="1">
                  <Text fontSize="lg" fontWeight="bold">{product.name}</Text>
                  {product.selectedPrices ? (
                    <Flex>
                      {product.selectedPrices.map((price, index) => (
                        <Text key={index} color="gray.600 " className='px-1'>
                          <strong>{index + 1} </strong>   : Ksh {price}
                        </Text>
                      ))}
                    </Flex>
                  ) : (
                    <></>
                  )}
                  <Flex justify="space-between" align="center" mt={2}>
                    <Text fontSize="xl" fontWeight="bold">Total: Ksh {calculateTotal(product)}</Text>
                    <Button onClick={() => removeCartProduct(index)} colorScheme="red" variant="outline" leftIcon={<FaTrashAlt />}>
                      Remove
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}
        </div>

        {cartProducts?.length > 0 && (
          <Box position="sticky" bottom="0" p={4} bg="white" shadow="lg" borderTop="1px solid gray">
           
            {session ? (
              <Button onClick={() => setPopup(true)} colorScheme="orange" size="lg" width="full" mt={4}>
                Checkout (Ksh {grandTotal})
              </Button>
            ) : (
              <Link href="/login">
                <Button colorScheme="orange" size="lg" width="full" mt={4}>
                  Please sign in to checkout
                </Button>
              </Link>
            )}
           
          </Box>
        )}
      </section>

      {/* Popup Modal */}
      <Modal isOpen={popup} onClose={() => setPopup(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Checkout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text fontSize="lg" mb={4}>Choose Payment Method</Text>
              <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                <Stack spacing={4} direction='row'>
                  <Radio value="mpesa" colorScheme="orange">M-Pesa</Radio>
                  <Radio value="cash" colorScheme="orange">Pay Cash</Radio>
                </Stack>
              </RadioGroup>

              {paymentMethod === 'mpesa' && (
                <form onSubmit={handleMpesaPayment}>
                  <Input placeholder="Mpesa Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} mt={4} />
                  <Button type="submit" colorScheme="orange" width="full" mt={4} isLoading={loading}>Pay Ksh {grandTotal}</Button>
                </form>
              )}

              {paymentMethod === 'cash' && (
                <Box mt={4}>
                  <Text fontSize="lg">Pay Ksh {grandTotal} on delivery.</Text>
                  <Button colorScheme="orange" width="full" mt={4} onClick={handleCashPayment} isLoading={loading}>Place Order</Button>
                </Box>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CartPage;
