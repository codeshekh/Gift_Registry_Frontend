'use client'; // Mark this file as a client component

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const userData = searchParams.get('user');
    if (userData) {
      setUser(JSON.parse(decodeURIComponent(userData as string)));
    }
  }, [searchParams]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
      <img src={user.profilePic} alt="Profile Picture" className="rounded-full w-32 h-32 my-4" />
      <p>Email: {user.email}</p>
      <p>Google ID: {user.googleId}</p>
      
    </div>
  );
};

export default Profile;
