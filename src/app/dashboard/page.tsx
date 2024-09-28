"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to install axios

const Page: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "W_elcome to Present Pal!"; // Text to display
  const descriptionText = "Your AI-powered event management solution."; // Description
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [aiResponse, setAiResponse] = useState(''); // State to store AI response

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

  const handleSearch = async () => {
    if (!searchQuery) return; // Prevent empty search

    try {
      const response = await axios.post('http://localhost:4000/ai-endpoint', {
        query: searchQuery,
      });
      setAiResponse(response.data); // Update AI response state
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAiResponse('Error fetching AI response');
    }
  };

  return (
    <div 
      className="flex items-center justify-center h-screen bg-cover bg-center mt-0.5 mb-0.4" 
      style={{ backgroundImage: "url('/home.jpg')" }} 
    >
      <div className="flex flex-col items-center bg-white bg-opacity-75 rounded-lg p-6"> 
        <h1 className="text-4xl font-bold text-black mt-4">{typedText}</h1>
        <p className="text-lg text-gray-700 mt-2">{descriptionText}</p>
        <div className="flex mt-4">
          <input 
            type="text" 
            placeholder="Use AI" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update input state
            className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <button 
            onClick={handleSearch}
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
          >
            Search
          </button>
        </div>
        {aiResponse && (
          <div className="mt-4 p-2 border border-gray-300 rounded-lg bg-white">
            <p className="text-lg text-gray-800">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
