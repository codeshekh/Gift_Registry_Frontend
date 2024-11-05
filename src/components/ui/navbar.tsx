import React from 'react';
import Link from 'next/link';
import { useSession } from '@/components/ui/session'; 
import ProfilePopover from './profilepop'; 
import { Button } from "@/components/ui/button";
import { FaGoogle } from 'react-icons/fa';
import '@/app/globals.css'; 

const Navbar: React.FC = () => {
  const session = useSession();
  const user = session?.user;
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <nav className="shadow-md py-4 px-4 flex justify-between items-center bg-white text-yellow-400">
      <div className="text-4xl font-bold">PresentPal</div>
      <div className="flex items-center">
        <Link href="/dashboard" className="relative mr-16 flex items-center text-black font-bold hover:text-gray-600 transition duration-300" aria-label="Home">
          Home
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>
        
        <Link href="/allevents" className="relative mr-16 flex items-center text-black font-bold hover:text-gray-600 transition duration-300" aria-label="Products">
          Events
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        <Link href="/products" className="relative mr-16 flex items-center text-black font-bold hover:text-gray-600 transition duration-300" aria-label="Products">
          Products
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        <Link href="/groups" className="relative mr-16 flex items-center text-black font-bold hover:text-gray-600 transition duration-300" aria-label="Groups">
          Group
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        {/* <Link href="/registries" className="relative mr-16 flex items-center text-black font-bold hover:text-gray-600 transition duration-300" aria-label="Registries">
          Registry
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link> */}
       
{/*        
        <Link href="/scrape" className="relative mr-16 flex items-center text-black font-bold hover:text-gray-600 transition duration-300" aria-label="Registries">
          Scraper
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link> */}

        {!session ? (
          <div className='mr-16'>
            <div className="relative overflow-hidden rounded-lg">
              <Button
                onClick={handleGoogleLogin}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 hover:bg-red-700"
              >
                <FaGoogle size={20} className="mr-2" />
                Sign in with Google
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center mr-10">
            
            <div className="relative flex items-center cursor-pointer ">
              <ProfilePopover 
                name={session.user?.username || 'User'}
                email={session.user?.email || 'user@example.com'}
                profilePic={session.user?.profilePic ?? ""} 
              />
            </div>
          </div>
        )}
      </div>
    
    </nav>
  );
};

export default Navbar;
