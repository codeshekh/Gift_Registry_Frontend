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

  return (
    <SessionProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen bg-white">
          {!isSignup && <Navbar />}

          <main className="flex-grow bg-gradient-to-b from-blue-50 to-white">
            {children}
          </main>

          {!isSignup && <Footer />}
        </body>
      </html>
    </SessionProvider>
  );
}
