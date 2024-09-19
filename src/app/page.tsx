// app/page.tsx
"use client";

import GoogleLoginButton from '@/components/ui/Googleuser';
// import Navbar from '@/components/ui/navbar';
import React from 'react';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-cover bg-center">
     
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-sm w-full dark:bg-white dark:bg-opacity-20">
          <h1 className="text-4xl font-bold mb-6 text-center text-white dark:text-gray-900">PresentPal</h1>
          <p className="text-center text-white mb-6 dark:text-gray-800">Where you can choose gifts for others</p>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}