import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "./AppProvider";
import { signOut, useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  const { cartProducts} = useContext(CartContext);
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
       <div className="fixed top-0 left-0 w-full bg-white p-4 px-4 flex items-center justify-between z-50 shadow-sm">
      <div>
        <Link href="/">
          <h1 className="text-primary md:text-3xl text-xl font-extrabold tracking-widest">
            Tuk Cafeteria
          </h1>
        </Link>
      </div>
      <div className="menu md:hidden flex gap-2 text-gray-200">    
        <Link href={'/cart'} className="relative mt-2 mr-2">
            <FaShoppingCart className="text-gray-600" />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
            {cartProducts.length}
          </span>
            )}
          </Link>
      
        <button  onClick={toggleSidebar}>

          {isOpen?
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-800">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-800">
           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
           </svg>   
          }
         
        </button>
          
      </div>
      <div className="md:flex hidden gap-2 text-gray-900 items-center">
        <Link className="text-gray-700 text-lg hover:text-primary" href="/">Home</Link>
        <Link className="text-gray-700 text-lg hover:text-primary" href="/menu">Menu</Link>
        {
          session?(
            <>
            <Link className="text-gray-700 text-lg hover:text-primary" href="/profile">Profile</Link>
          <button
            onClick={handleLogout}
            className=" text-lg text-red-400 px-5 py-[3px] rounded-lg"
          >
            Logout
          </button>
           </>
          ):(
            <>
            <Link className="text-gray-700 text-lg hover:text-primary" href="/login">Sign In</Link>
           
            </>
          )
        }
        <Link href={'/cart'} className="relative mt-2 mr-3">
            <FaShoppingCart className="text-gray-600" />
            {cartProducts?.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">
            {cartProducts.length}
          </span>
            )}
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
            <Link className="text-gray-200 text-lg hover:text-primary" href="/">Home</Link>
            <Link className="text-gray-200 text-lg hover:text-primary" href="/menu">Menu</Link>
              {!session && (
                <>
                 <Link className="text-gray-200 text-lg hover:text-primary" onClick={toggleSidebar} href="/login">Sign In</Link>
                </>
              )}
              {session && (
               <>
                <Link className="text-gray-200 text-lg hover:text-primary" href="/profile">Profile</Link>
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
