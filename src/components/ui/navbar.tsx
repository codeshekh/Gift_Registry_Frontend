import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component
import ThemeToggle from './toggletheme'; // Ensure the correct import path


const Navbar = () => {
  return (
    <nav className="bg-white bg-opacity-10 backdrop-blur-lg shadow-md py-4 px-8 flex justify-between items-center dark:bg-gray-800">
      <div className="text-2xl font-bold text-black dark:text-white">
        <Link href="/">PresentPal</Link>
      </div>
      <div className="flex space-x-4 items-center">
        <Link href="/" className="text-black dark:text-white hover:font-bold">
          Home
        </Link>
        <Link href="/about" className="text-black dark:text-white hover:font-bold">
          About
        </Link>
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {/* <Image 
              src="/profile-pic.jpg" // Path to your profile picture
              alt="Profile Picture"
              width={40} // Adjust width as needed
              height={40} // Adjust height as needed
              className="object-cover" // Optional: to maintain aspect ratio and cover the div
            /> */}
          </div>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
