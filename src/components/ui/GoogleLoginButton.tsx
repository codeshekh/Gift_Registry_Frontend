// components/GoogleLoginButton.tsx
'use client'; // Ensure this component is treated as a client component

import React from 'react';
import { FaGoogle } from 'react-icons/fa';

const GoogleLoginButton = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log(apiUrl)
  const handleLogin = async () => {
    try {
      // Send a GET request to your NestJS backend
      const response = await fetch(`http://localhost:4000/auth/google`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("res--->"+ response);

      if (response.ok) {
        const data = await response.json();
        if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          console.error('Redirect URL not found in response');
        }
      } else {
        console.error('Login request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred while making the request:', error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 flex items-center justify-center"
    >
      <FaGoogle size={20} className="icon-color inline-block mr-2" /> {/* Google icon */}
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
