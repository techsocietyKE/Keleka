import '@/styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '@/utils/Providers';
import { AppProvider } from '@/components/AppProvider';


export default function App({ Component, pageProps }) {
  return (
    <>
      <AuthProvider>
        <ChakraProvider>
          <AppProvider>
            <Component {...pageProps} />
          </AppProvider>
        </ChakraProvider>
      </AuthProvider>
    </>
  );
}
