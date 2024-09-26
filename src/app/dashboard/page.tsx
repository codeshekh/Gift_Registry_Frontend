"use client";

import React, { useEffect, useState } from 'react';

const Page: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "W_elcome to Present Pal!"; // Text to display
  const descriptionText = "Your AI-powered event management solution."; // Description

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); 

    return () => clearInterval(typingInterval); 
  }, []);

  return (
    <div 
      className="flex items-center justify-center h-screen bg-cover bg-center mt-0.5 mb-0.4" 
      style={{ backgroundImage: "url('/home.jpg')" }} 
    >
      <div className="flex flex-col items-center bg-white bg-opacity-75 rounded-lg p-6"> 
        <h1 className="text-4xl font-bold text-black mt-4">{typedText}</h1>
        <p className="text-lg text-gray-700 mt-2">{descriptionText}</p>
        <input 
          type="text" 
          placeholder="Use AI" 
          className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4" 
        />
      </div>
    </div>
  );
};

export default Page;
