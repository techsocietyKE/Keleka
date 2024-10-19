import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import '@/styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
      {Component.auth ? (
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      ) : (
        <Component {...pageProps} />
      )}
       </ChakraProvider>
    </SessionProvider>
   
  );
}

// AuthGuard Component to check if the user is authenticated
function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If session is being loaded or checked
  if (status === 'loading') {
    return <div>Loading...</div>; // Optional loading state while session is checked
  }

  // If no session, redirect to login
  if (!session) {
    router.push('/login');
    return null; // Prevent rendering protected content while redirecting
  }

  // If authenticated, render the children (protected content)
  return children;
}
