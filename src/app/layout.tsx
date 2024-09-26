"use client"; // This ensures it's a client component

import React from 'react';
import Navbar from '@/components/ui/navbar';
import './globals.css';
import Footer from '@/components/ui/footer';
import { usePathname } from 'next/navigation';
export default function RootLayout({ children }: { children: React.ReactNode }) {

const pathname = usePathname();
const isSignup = pathname ==='/'
  return (
    <html lang="en">
      <body className="bg-white">
        
        {!isSignup &&  <Navbar /> }
        <main>{children}</main>
        {!isSignup && <Footer/>}
    
      </body>
    </html>
  );
}
