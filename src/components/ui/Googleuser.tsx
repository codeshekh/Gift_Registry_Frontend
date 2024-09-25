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
    <button
      onClick={handleLogin} // Call handleLogin when the button is clicked
      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 flex items-center justify-center"
    >
      <FaGoogle size={20} className="inline-block mr-2" />
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
