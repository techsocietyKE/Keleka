import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import { signOut, useSession } from "next-auth/react"; // Import signOut from NextAuth

export default function Header() {
  const { cartBooks } = useContext(CartContext);
  const { data: session } = useSession();
  const handleLogout = async () => {
    await signOut(); // Redirect to home after logout
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#201F31] p-6 px-4 flex items-center justify-between z-50 shadow-md">
      <div>
        <Link href="/">
          <h1 className="text-gray-100 md:text-3xl text-xl font-bold tracking-widest">
            Keleka Bookshop
          </h1>
        </Link>
      </div>
      <div className="flex gap-2 text-gray-900 items-center">
        <Link className="text-gray-300 text-lg hover:text-green-400" href="/">Home</Link>
        <Link className="text-gray-300 text-lg hover:text-green-400" href="/cart">Cart ({cartBooks.length})</Link>

        {
          session?(
           <>
          <Link className="text-gray-300 text-lg hover:text-green-400" href="/checkoutpage">Payment</Link>
          <button
            onClick={handleLogout}
            className="text-white text-lg bg-red-600 px-5 py-[3px] rounded-lg"
          >
            Logout
          </button>
           </>
          ):(
            <>
            <Link className="text-gray-300 text-lg hover:text-green-400" href="/login">Login</Link>
            
            <Link className="text-gray-300 text-lg hover:text-green-400" href="/register">Sign up</Link>
            </>
          )
        }
      </div>
    </div>
  );
}
