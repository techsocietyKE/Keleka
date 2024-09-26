
import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { CartContextProvider } from "@/components/CartContext";
import { AuthProvider } from '@/utils/Providers';


export default function App({ Component, pageProps }) {
 return(
  <>
  <AuthProvider>
   <ChakraProvider>
    <CartContextProvider>  

         <Component {...pageProps} />
    </CartContextProvider>
   </ChakraProvider>
   </AuthProvider>
  </>
 )
}
