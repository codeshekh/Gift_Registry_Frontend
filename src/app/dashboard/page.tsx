"use client";

import React from 'react';
import Image from 'next/image';

interface DashboardProps {
  isDarkMode: boolean;
}

const Page: React.FC<DashboardProps> = ({ isDarkMode }) => {
  return (
    <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex flex-col items-center">
        <Image 
          src="/lighthome.jpg" // Keeping the same image for display
          alt="Dashboard Image" 
          width={500}
          height={500}
          className="rounded-lg shadow-lg" // Adding some styling
        />
        <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-black'} mt-4`}>
          Welcome to Present Pal
        </h1>
      </div>
    </div>
  );
};

export default Page;
