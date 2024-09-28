"use client";

import { useState, useEffect, FC } from "react";

interface Gift {
  id: number;
  giftName: string;
  giftUrl: string;
  registryId: number;
}

const GiftPage: FC = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [registryId, setRegistryId] = useState<number | undefined>(undefined);
  const [gifts, setGifts] = useState<Gift[]>([]); // Empty initially
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch gifts by registryId from the backend
  const fetchGifts = async (registryId: number | undefined) => {
    if (!registryId) return;
    try {
      const response = await fetch(`http://localhost:4000/gifts/registry/${registryId}`);
      if (response.ok) {
        const data = await response.json();
        setGifts(data); // Update state with fetched gifts
      } else {
        setError("Failed to fetch gifts");
      }
    } catch (err) {
      setError("An error occurred while fetching gifts");
    }
  };

  useEffect(() => {
    // Fetch gifts only if a valid registryId is provided
    if (registryId) {
      fetchGifts(registryId);
    }
  }, [registryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Input validation
    if (!name || !url || !registryId) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    // Create new gift object
    const newGift = {
      giftName: name,
      giftUrl: url,
      registryId,
    };

    try {
      const response = await fetch("http://localhost:4000/gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGift),
      });

      if (response.ok) {
        const createdGift = await response.json();
        setGifts((prevGifts) => [...prevGifts, createdGift]); // Add the new gift to the gift list
        setName("");
        setUrl("");
        setRegistryId(undefined);
      } else {
        setError("Failed to create gift");
      }
    } catch (err) {
      setError("An error occurred while creating the gift");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGift = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/gifts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setGifts(gifts.filter(gift => gift.id !== id)); // Update state to remove deleted gift
      } else {
        setError("Failed to delete gift");
      }
    } catch (err) {
      setError("An error occurred while deleting the gift");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Gift</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium">Gift Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter gift name"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Gift URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter gift URL"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium">Registry ID</label>
          <input
            type="number"
            value={registryId}
            onChange={(e) => setRegistryId(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter registry ID"
            required
          />
        </div>
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-500" : "bg-blue-500"}`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Gift"}
        </button>
      </form>

      {/* Displaying gifts in card format */}
      <h2 className="text-lg font-semibold mt-8">Available Gifts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {gifts.map((gift) => (
          <div key={gift.id} className="bg-white p-4 rounded-lg shadow-lg border">
            <h3 className="text-xl font-semibold">{gift.giftName}</h3>
            <a href={gift.giftUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 block">
              View Gift
            </a>
            <p className="mt-2 text-sm">Registry ID: {gift.registryId}</p>
            <button
              className="mt-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => handleDeleteGift(gift.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftPage;
