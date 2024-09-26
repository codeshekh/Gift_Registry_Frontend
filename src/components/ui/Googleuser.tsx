"use client"; // Ensures this is a client component

import React from 'react';
import { FaGoogle } from 'react-icons/fa'; // Importing Google icon

interface GoogleLoginButtonProps {
  onClick?: () => void; // Optional onClick prop
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => {
  const handleLogin = () => {
    // Redirect to the backend's Google login route
    window.location.href = 'http://localhost:4000/auth/google';
    // If you want to call the onClick from props, you can uncomment the line below
    // onClick && onClick();
  };

  return (
    <div className='relative overflow-hidden rounded-lg'>
      <div className='absolute inset-0 bg-cover bg-center blur-md' style={{ backgroundImage: "url('signup.jpg')" }} />
      <button
        onClick={handleLogin} 
        className="relative z-10 w-full text-white py-2 px-4 rounded-lg flex items-center justify-center transition duration-300 hover:shadow-lg"
        style={{ backdropFilter: 'blur(5px)' }}
      >
        <FaGoogle size={20} className="inline-block mr-2" />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
