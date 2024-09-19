// app/page.tsx
"use client"
import React from 'react';
import GoogleLoginButton from '../components/ui/GoogleLoginButton';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-cover bg-center">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
