import Nav from '@/components/Nav';
import {useSession,signIn,signOut} from 'next-auth/react'
import { useState } from 'react';
import Logo from './Logo';

export default function Layout({children}) {
  const [showNav,setShowNav] = useState(false)


  return (
    <div className='min-h-screen bg-indigo-100'>
     <div className='block md:hidden flex items-center p-4 '>
     <button onClick={()=>setShowNav(true)}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>

      </button>
      <div className='flex grow justify-center mr-6'>
      <Logo/>
      </div>
     </div>
       <div className='bg-indigo-100 min-h-screen flex'>
      <Nav show={showNav}/>
      <div className='bg-white shadow-lg   md:p-8 flex-grow mt-2 mb-2 mr-2 rounded-lg p-3'>
        {children}
      </div>
    </div>
    </div>
   
    
  )
 
}