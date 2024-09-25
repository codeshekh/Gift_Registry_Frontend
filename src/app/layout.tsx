"use client"; // This ensures it's a client component

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import './globals.css';
import Footer from '@/components/ui/footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Load the saved theme from localStorage or use media query preference
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  return (
    <html lang="en">
      <body className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
