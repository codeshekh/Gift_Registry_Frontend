'use client'; // If you're using Next.js with client components

import { useState, FC } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'; 
import Gift from '../gift/page';

const Page: FC = () => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [eventId, setEventId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registries, setRegistries] = useState([
    { id: 1, name: 'Default Registry 1', userId: 1, eventId: 101 },
    { id: 2, name: 'Default Registry 2', userId: 2, eventId: 102 },
  ]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!name || userId === undefined || eventId === undefined) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/registries', {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, userId, eventId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setRegistries([...registries, { id: data.id, name, userId, eventId }]);
        setIsPopoverOpen(false); // Close popover on success
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('Failed to submit the form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    
      <div className="h-screen flex">
        <ResizablePanelGroup direction={'horizontal'}>
          
          {/* Left Panel (Registries Section) */}
          <ResizablePanel defaultSize={40} className="flex flex-col border-r bg-gray-50 p-6">
            <h1 className="text-2xl font-bold mb-6">Registries</h1>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600">
                  Create New Registry
                </button>
              </PopoverTrigger>

              <PopoverContent className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-semibold">Create Registry</h2>
                  {error && <p className="text-red-500">{error}</p>}

                  <div>
                    <label className="block text-lg font-medium">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter registry name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium">User ID</label>
                    <input
                      type="number"
                      value={userId}
                      onChange={(e) => setUserId(Number(e.target.value))}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter user ID"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium">Event ID</label>
                    <input
                      type="number"
                      value={eventId}
                      onChange={(e) => setEventId(Number(e.target.value))}
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter event ID"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-500' : 'bg-blue-500'}`}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Registry'}
                  </button>
                </form>
              </PopoverContent>
            </Popover>

            <div className="grid grid-cols-1 gap-4 mt-6">
              {registries.map((registry) => (
                <div key={registry.id} className="bg-white p-4 rounded-lg shadow-lg border">
                  <h3 className="text-lg font-semibold">{registry.name}</h3>
                  <p className="text-gray-600">User ID: {registry.userId}</p>
                  <p className="text-gray-600">Event ID: {registry.eventId}</p>
                </div>
              ))}
            </div>
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle className="bg-gray-400" withHandle />

          {/* Right Panel (Gifts Section) */}
          <ResizablePanel className="flex flex-1 bg-white p-6">
            <div className="flex flex-col w-full">
              <h2 className="text-2xl font-bold mb-4">Gifts</h2>
              <div className="flex-1 overflow-auto">
                {/* Replace this with your actual Gift component logic */}
                <Gift />
              </div>
            </div>
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle className="bg-gray-400" withHandle />

      
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Page;
