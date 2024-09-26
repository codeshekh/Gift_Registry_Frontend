"use client";
import React from 'react';
import { useSession } from '@/components/ui/session'; // Ensure this path is correct

const Profile: React.FC = () => {
  const session = useSession();

  // Log session data to debug
  console.log('Session data:', session);

  if (!session) {
    return <div>Loading...</div>; // Loading state or redirect to login
  }

  const { user } = session;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Profile Page</h1>
      {user ? (
        <div className="mt-4">
          <img 
            src={user.image || '/onepiece.png'} 
            alt="Profile" 
            className="rounded-full h-40 w-40 object-cover"
          />
          <h2 className="text-xl mt-2">{user.username}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Profile;
