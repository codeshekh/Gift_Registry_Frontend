"use client"; 
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '@/components/ui/session'; 
import GoogleLoginButton from '@/components/ui/Googleuser';
import { useRouter } from 'next/navigation';
interface CustomSession {
  user?: {
    image?: string;
    username?: string;
    email?: string;
  };
}

const Navbar: React.FC = () => {
  const session: CustomSession | null = useSession(); // Access the session object
  const router = useRouter();


  return (

    <nav className="shadow-md py-4 px-6 flex justify-between items-center bg-white relative">
      <div className="text-4xl font-white text-black">PresentPal</div>
      <div className="flex items-center">
        <Link href="/dashboard" className="relative mr-10 text-black font-bold hover:text-blue-500 transition duration-300">
          Home
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>
        <Link href="/about" className="relative mr-10 text-black font-bold hover:text-blue-500 transition duration-300">
          About
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>
        <Link href="/event" className="relative mr-10 text-black font-bold hover:text-blue-500 transition duration-300">
          Event
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>
        <Link href="/groups" className="relative mr-10 text-black font-bold hover:text-blue-500 transition duration-300">
          Groups
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>
        <Link href="/registries" className="relative mr-10 text-black font-bold hover:text-blue-500 transition duration-300">
          Registries
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        {/* Profile Picture or Google Login Button */}
        {session?.user ? (
          <Link href="/profile">
            <div className="relative">
              <Image
                src={session.user.image || '/onepiece.png'} // Use default profile picture if no image
                alt="Profile Picture"
                width={40}
                height={40}
                className="rounded-full border-2 border-transparent hover:border-blue-500 transition duration-300"
              />
            </div>
          </Link>
        ) : (
          <div className='mr-10'>
            <GoogleLoginButton /> 
          </div>
        )}
      </div>
      {/* Shine effect using a gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-30 pointer-events-none"></div>
    </nav>
  );
};

export default Navbar; 
