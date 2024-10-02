// utils/withAuth.js

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuth(Component, allowedRoles = []) {
  return function ProtectedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return; // Wait for session to load
      if (status === "unauthenticated" || !session?.user) {
        router.push("/login"); // Redirect to login if not authenticated
      } else if (!allowedRoles.includes(session?.user?.role)) {
        
        router.push("/unauthorized"); // Redirect if not authorized
      }
    }, [session, status, router, allowedRoles]);

    if (status === "loading" || !session?.user || !allowedRoles.includes(session?.user?.role)) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}
