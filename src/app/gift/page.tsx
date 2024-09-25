"use client";

import { useState, FC } from "react";
import { useRouter } from "next/navigation";

const GiftPage: FC = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");  
  const [registryId, setRegistryId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();



  
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
  
    try {
      const response = await fetch("http://localhost:4000/gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Sending giftName instead of name
        body: JSON.stringify({ giftName: name, giftUrl: url, registryId }), 
      });
  
      if (response.ok) {
        router.push("/gifts");
      } else {
        const data = await response.json();
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to submit the form");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
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
            className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-500' : 'bg-blue-500'}`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Gift"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GiftPage;
