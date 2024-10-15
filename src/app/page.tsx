"use client";

import GoogleLoginButton from '@/components/ui/Googleuser'; // Ensure correct import path
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSignup = () => {
    // Redirect to dashboard after signup
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900">
          PresentPal
        </h1>
        <p className="text-center text-gray-800 mb-6">
          Where you can choose gifts for others
        </p>

        <GoogleLoginButton />
      </div>
    </div>
  );
}
