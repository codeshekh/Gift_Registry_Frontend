import React from 'react';
import Link from 'next/link';
import { useSession } from '@/components/ui/session'; 
import GoogleLoginButton from '@/components/ui/Googleuser';
import ProfilePopover from './profilepop'; // Import your ProfilePopover component
import { HomeIcon, CalendarIcon, UsersIcon, GiftIcon, UserCircleIcon } from 'lucide-react'; // Import icons

const Navbar: React.FC = () => {
  const session = useSession();

  return (
    <nav className="shadow-md py-4 px-6 flex justify-between items-center bg-white relative">
      <div className="text-4xl font-bold text-black">PresentPal</div>
      <div className="flex items-center">
        <Link href="/dashboard" className="relative mr-10 flex items-center text-black font-bold hover:text-blue-500 transition duration-300">
          <HomeIcon className="w-5 h-5 mr-2" />
          Home
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link> 

        <Link href="/event" className="relative mr-10 flex items-center text-black font-bold hover:text-blue-500 transition duration-300">
          <CalendarIcon className="w-5 h-5 mr-2" />
          Events
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link> 

        <Link href="/groups" className="relative mr-10 flex items-center text-black font-bold hover:text-blue-500 transition duration-300">
          <UsersIcon className="w-5 h-5 mr-2" />
          Group
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link> 

        <Link href="/registries" className="relative mr-10 flex items-center text-black font-bold hover:text-blue-500 transition duration-300">
          <GiftIcon className="w-5 h-5 mr-2" />
          Registry
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </Link> 

        {!session ? (
          <div className='mr-10'>
            <GoogleLoginButton /> 
          </div>
        ) : (
          <div className="relative flex items-center mr-10">
            <ProfilePopover 
              name={session.user?.username || 'User'} 
              email={session.user?.email || 'user@example.com'} 
              avatarUrl={session.user?.profilePic} 
            />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-30 pointer-events-none"></div>
    </nav>
  );
};

export default Navbar;
