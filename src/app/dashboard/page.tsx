// app/dashboard/page.tsx
"use client"
import Navbar from '@/components/ui/navbar';

import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="p-8">
      
        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </div>
  );
}
