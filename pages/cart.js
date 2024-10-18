import { CartContext } from '@/components/AppProvider';
import Header from '@/components/Header';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { FaTrashAlt } from "react-icons/fa";
import { Button, Input, Box, Text, RadioGroup, Stack, Radio, useToast } from "@chakra-ui/react";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { data: session } = useSession();
  const { cartProducts, removeCartProduct } = useContext(CartContext);
  const [popup, setPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const  router = useRouter();
  const calculateTotal = (product) => {
    if (product.selectedPrices && product.selectedPrices.length > 0) {
      return product.selectedPrices.reduce((acc, price) => acc + Number(price), 0);
    }
    return Number(product.basePrice);  
  };

  const calculateGrandTotal = () => {
    return cartProducts.reduce((acc, product) => acc + calculateTotal(product), 0);
  };

  let  grandTotal = calculateGrandTotal();


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
            userId: session?.user?.id, email: session?.user?.email, name:session?.user?.fullname,
          });
          console.log('Payment Success:', result);
        } else {
          const error = await response.json();
          console.log('Payment Error:', error);
          await saveOrder({
            grandTotal, cartProducts, paymentMethod, paid: false, Mpesa: false,
            userId: session?.user?.id, email: session?.user?.email,name:session?.user?.fullname,
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
  
      } else if (paymentMethod === 'cod') {
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
          name:session?.user?.fullname,
        });
        
        console.log('COD Order processed successfully.');
      }
  
      setTimeout(() => {
        router.push('/profile');
      }, paymentMethod === 'mpesa' ? 15000 : 10000);  // Adjust redirect time for Mpesa or COD
    } catch (error) {
      console.error('Error during payment initiation:', error);
  
      await saveOrder({
        grandTotal, cartProducts, paymentMethod,
        paid: false, Mpesa: false, userId: session?.user?.id, email: session?.user?.email,
        name:session?.user?.fullname,
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
  
  const handleCODPayment = async () => {
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
        paymentMethod: 'cod',
        paid: false,  // Payment not yet made
        Mpesa: false,  // M-Pesa is not used
        userId: session?.user?.id,
        email: session?.user?.email,
        name: session?.user?.fullname,
      });
  
      console.log('COD Order processed successfully.');
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
      console.error('Error during COD order processing:', error);
  
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
    <div>
      <Header />
      <section className='mt-20 ml-5 overflow-y-scroll flex flex-col justify-center'>
        <h2 className='text-xl font-semibold tracking-wider p-3'>Your Items to Checkout</h2>
        <div>
          <div>
            {cartProducts?.length === 0 && (
              <p>No items in your cart</p>
            )}
            {cartProducts?.length > 0 && cartProducts.map((product, index) => (
              <div key={product._id} className='flex items-center gap-4 mb-2 border-b py-2'>
                <div className='w-24'>
                  <Image width={240} height={240} src={product.image} className='rounded-lg' alt={product.name} />
                </div>
                <div>
                  <h3 className='text-lg font-bold'>{product.name}</h3>

                  {/* Check if there are selectedPrices */}
                  {product.selectedPrices ? (
                    <div className='flex flex-row'>
                      {product.selectedPrices.map((price, index) => (
                        <span key={index} className='text-gray-600 flex flex-row'>
                          <p className='font-bold mx-2'>{index + 1}</p> : Ksh {price}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <h3 className='text-md'>Ksh {product.basePrice}</h3>
                  )}
                  <div className='flex items-center justify-between'>
                    <h1 className='text-xl font-semibold'>
                      Total: Ksh {calculateTotal(product)}
                    </h1>

                    <button 
                      onClick={() => removeCartProduct(index)} 
                      className='text-black-500 flex items-center mt-2 border border-gray-300 p-2 ml-3 rounded-md'>
                      <FaTrashAlt className='mr-1' />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Make the total section sticky at the bottom */}
        {cartProducts?.length > 0 && (
          <div className='mt-6 p-4 border-t border-gray-300 sticky bottom-0 bg-white'>
            <h1 className='text-2xl font-bold'>
               Total Amount to Pay: Ksh {grandTotal}
            </h1>
            <button onClick={() =>setPopup(true)} className='bg-primary text-white px-10 py-2 my-2 rounded-md text-lg font-semibold'>
               Checkout
            </button>
          </div>
        )}
      </section>

      {/* Popup */}
      {popup && (
        <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto'>
            <h2 className='text-xl font-semibold'>Checkout</h2>
            <Box className="shadow-lg p-6 bg-white rounded-md">
       

       <Text fontSize="2xl" fontWeight="bold" color="orange.500" mt={6} mb={2}>Payment Information</Text>
       <Text fontSize="lg" color="orange.700" mb={2}>Choose a Payment Method</Text>
       <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
         <Stack spacing={4} direction='row'>
           <Radio value="mpesa" colorScheme="orange">M-Pesa</Radio>
           <Radio value="cod" colorScheme="orange">Pay Cash</Radio>
         </Stack>
       </RadioGroup>

      
       {paymentMethod === 'mpesa' && (
        <div>
         <Text fontSize="2xl" fontWeight="bold" mt={2} color="orange.700" mb={4}>Checkout Information</Text>
          <form onSubmit={handleMpesaPayment} className="my-6 border p-4 rounded-md bg-gray-50">
           <Text textAlign="center" fontSize="lg" fontWeight="bold" color="orange.500 " className="text-sm ">Pay with Mpesa</Text>
           <Input variant="outline" placeholder="Mpesa Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} mb={4} />
           <Button colorScheme="orange" type="submit" width="full" isDisabled={loading}>
             {loading ? "Processing..." : `Pay ${grandTotal}`}
           </Button>
         </form>
        </div>
       )}

       {paymentMethod === 'cod' && (
         <Box mt={6}>
           <Text fontSize="2xl" fontWeight="bold" color="orange.500" mb={4}>Cash</Text>
                 <Text fontSize="lg" color="gray.700" mb={2}>Cash You Will Pay Ksh ({grandTotal})</Text>
                 <Button colorScheme="orange" width="full" isDisabled={loading} onClick={handleCODPayment}>
  {loading ? "Processing..." : "Finish Checkout"}
</Button>

         </Box>
       )}
     </Box>
            <button 
              onClick={() => setPopup(false)} 
              className='mt-4 bg-red-500 text-white p-2 rounded-md'>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
