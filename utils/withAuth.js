// withAuth.js
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return; // Wait for the session to load
      if (!session) {
        router.push('/login'); // Redirect to login if not authenticated
      }
    }, [session, status]);

    // If the session is loading or user is not authenticated, return null or a loading indicator
    if (status === "loading" || !session) {
      return null; // Or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
