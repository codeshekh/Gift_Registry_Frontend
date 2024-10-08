import React from 'react';
import Link from 'next/link';
import { useSession } from '@/components/ui/session'; 
import GoogleLoginButton from '@/components/ui/Googleuser';
import ProfilePopover from './profilepop'; 
import { Button } from "@/components/ui/button";
import { FaGoogle } from 'react-icons/fa';
import '@/app/globals.css'; // Ensure your global CSS is imported

const Navbar: React.FC = () => {
  const session = useSession();

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <nav className="shadow-md py-4 px-6 flex justify-between items-center bg-white text-yellow-400 glow">
      <div className="text-4xl font-bold">PresentPal</div>
      <div className="flex items-center">
        <Link href="/dashboard" className="relative mr-16 flex items-center text-black font-bold hover:text-gray-600 transition duration-300" aria-label="Home">
          Home
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        <Link href="/event" className="relative mr-16 flex items-center text-black font-bold hover:text-gray-600 transition duration-300" aria-label="Events">
          Events
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        <Link href="/groups" className="relative mr-16 flex items-center text-black font-bold hover:text-gray-600 transition duration-300" aria-label="Groups">
          Group
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

        <Link href="/registries" className="relative mr-16 flex items-center text-black font-bold hover:text-gray-600 transition duration-300" aria-label="Registries">
          Registry
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link>

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
            {/* Profile Popover with shining effect */}
            <div className="relative flex items-center cursor-pointer shining-effect">
              <ProfilePopover 
                name={session.user?.username || 'User'}
                email={session.user?.email || 'user@example.com'}
                profilePic={session.user?.profilePic} 
                id={0} 
              />
            </div>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 opacity-10 pointer-events-none"></div>
    </nav>
  );
};

export default Navbar;
