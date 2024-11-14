"use client";
import GoogleLoginButton from '@/components/ui/Googleuser'; // Ensure correct import path
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className='bg-white'>
        <GoogleLoginButton />  
    </div>
  );
}
