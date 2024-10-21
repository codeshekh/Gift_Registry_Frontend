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
    <div className='bg-white'>
        <GoogleLoginButton />  
    </div>
  );
}
