import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import { signOut, useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation";

export default function Header() {
  const { cartBooks } = useContext(CartContext);
  const { data: session } = useSession();
  const router = useRouter();
  const handleLogout = async () => {
    await signOut(); 
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
       <div className="fixed top-0 left-0 w-full bg-[#201F31] p-6 px-4 flex items-center justify-between z-50 shadow-md">
      <div>
        <Link href="/">
          <h1 className="text-gray-100 md:text-3xl text-xl font-bold tracking-widest">
            Keleka Bookshop
          </h1>
        </Link>
      </div>
      <div className="menu md:hidden flex gap-2 text-white">
      <Link className="text-gray-300 text-lg hover:text-green-400 flex items-center space-x-2" href="/cart">
         <span className="font-semibold">Cart</span>
         <span className="bg-green-400 text-white text-sm font-medium rounded-full px-1">
         {cartBooks.length}
         </span>
         </Link>
        <button  onClick={toggleSidebar}>

          {isOpen?
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
           </svg>   
          }
         
        </button>
          
      </div>
      <div className="md:flex hidden gap-2 text-gray-900 items-center">
        <Link className="text-gray-300 text-lg hover:text-green-400" href="/">Home</Link>
        <Link className="text-gray-300 text-lg hover:text-green-400" href="/categories">Genres</Link>
        {
          session?(
            <>
            <Link className="text-gray-300 text-lg hover:text-green-400" href="/profile">Profile</Link>
          <button
            onClick={handleLogout}
            className=" text-lg text-red-400 px-5 py-[3px] rounded-lg"
          >
            Logout
          </button>
           </>
          ):(
            <>
            <Link className="text-gray-300 text-lg hover:text-green-400" href="/login">Sign In</Link>
            <Link className="text-gray-300 text-lg hover:text-green-400" href="/register">Register</Link>
            </>
          )
        }
       <Link className="text-gray-300 text-lg hover:text-green-400 flex items-center space-x-2" href="/cart">
         <span className="font-semibold">Cart</span>
         <span className="bg-green-400 text-white text-sm font-medium rounded-full px-1">
         {cartBooks.length}
         </span>
         </Link>
      </div>
    </div>

    <div className="relative">
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transition-transform duration-300 transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col p-4">
            
            <button className="self-end mb-4 p-4" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

            </button>

            
            <nav className='flex flex-col gap-4 text-lg'>
            <Link className="text-gray-300 text-lg hover:text-green-400" href="/">Home</Link>
            <Link className="text-gray-300 text-lg hover:text-green-400" href="/categories">Genres</Link>

              {!session && (
                <>
                 <Link className="text-gray-300 text-lg hover:text-green-400" onClick={toggleSidebar} href="/login">Sign In</Link>
                 <Link className="text-gray-300 text-lg hover:text-green-400" onClick={toggleSidebar} href="/register">Register</Link>
                </>
              )}
              {session && (
               <>
                <Link className="text-gray-300 text-lg hover:text-green-400" href="/profile">Profile</Link>
                <button onClick={() => { handleLogout(); toggleSidebar(); }} className='hover:text-[#EB5255] transition-colors duration-300'>
                  Logout
                </button>
               </>
              )}
            </nav>
          </div>
        </div>

        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20"
            onClick={toggleSidebar}
          ></div>
        )}
      </div>
    </div>
   
  );
}
