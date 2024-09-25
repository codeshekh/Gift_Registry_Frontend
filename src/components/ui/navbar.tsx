"use client"; // Ensures it's a client component

import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <nav className={`shadow-md py-4 px-6 flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
        PresentPal
      </div>
      <div className="flex items-center space-x-6">
        <Link href="dashboard" className={`hover:text-gray-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Home
        </Link>
        <Link href="/about" className={`hover:text-gray-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          About
        </Link>
        <Link href="/event" className={`hover:text-gray-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Event
        </Link>
        <Link href="/groups" className={`hover:text-gray-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Groups
        </Link>
        <Link href="/registries" className={`hover:text-gray-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Registries
        </Link>
        <button 
          onClick={toggleTheme} 
          className="flex items-center justify-center h-10 w-10 rounded-full transition-colors duration-200 
                     bg-dark dark:bg-white hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-800" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
