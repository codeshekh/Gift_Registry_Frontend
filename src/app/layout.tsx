"use client"; // This ensures it's a client component

import React from 'react';
import Navbar from '@/components/ui/navbar';
import './globals.css';
import Footer from '@/components/ui/footer';
import { usePathname } from 'next/navigation';
import { SessionProvider } from '@/context/SessionContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignup = pathname === '/';
  const isProductPage = pathname === '/products';
  return (
    <SessionProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen bg-gradient-to-b bg-inherit"> 
          {!isSignup &&  <Navbar />} {/* Add glow class here */}

          <main className="flex-grow  bg-white">
            {children}
          </main>

          {!isSignup && !isProductPage && <Footer />} 
        </body>
      </html>
    </SessionProvider>
  );
}
