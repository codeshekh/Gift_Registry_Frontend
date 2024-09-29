'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Page: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "W_elcome to Present Pal!";
  const descriptionText = "Your AI-powered event management solution.";
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Typing effect for welcome text
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

  // Function to fetch suggestions
  const handleSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/ai/suggestions', {
        query,
      });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  // Function to fetch search results
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.post('http://localhost:4000/ai', {
        query: searchQuery,
      });
      setAiResponse(response.data.result);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAiResponse('Error fetching AI response');
    }
  };

  // Handle input change for real-time suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSuggestions(query); // Fetch suggestions based on input
  };

  // Handle suggestion click to update the search query
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSuggestions([]); // Clear suggestions after selecting one
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center mt-0.5 mb-0.4"
      style={{ backgroundImage: "url('/home.jpg')" }}
    >
      <div className="flex flex-col items-center bg-white bg-opacity-75 rounded-lg p-6">
        <h1 className="text-4xl font-bold text-black mt-4">{typedText}</h1>
        <p className="text-lg text-gray-700 mt-2">{descriptionText}</p>

        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Use AI"
            value={searchQuery}
            onChange={handleInputChange} // Update input state and fetch suggestions
            className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
          >
            Search
          </button>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)} // Update search query on click
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
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
