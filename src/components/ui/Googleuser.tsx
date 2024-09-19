// components/GoogleLoginButton.tsx
'use client';

import React from 'react';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = () => {
  const handleLogin = () => {
    // Redirect to the backend's Google login route
    window.location.href = 'http://localhost:4000/auth/google';
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 flex items-center justify-center"
    >
      <FaGoogle size={20} className="icon-color inline-block mr-2" />
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
