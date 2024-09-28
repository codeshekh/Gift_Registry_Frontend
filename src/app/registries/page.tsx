'use client'; // If you're using Next.js with client components

import { useState, FC } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon } from 'lucide-react';
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

  const handleDeleteRegistry = (id: number) => {
    setRegistries(registries.filter(registry => registry.id !== id));
  };

  // New function for the add action (if needed)
  const handleAddRegistry = (registryId: number) => {
    console.log(`Adding registry with ID: ${registryId}`);
    // Implement the action you want to perform here
  };

  return (
    <div className="h-screen flex">
      <ResizablePanelGroup direction={'horizontal'}>
        {/* Left Panel (Registries Section) */}
        <ResizablePanel defaultSize={40} className="flex flex-col border-r bg-gray-50 p-6">
          <h1 className="text-2xl font-bold mb-6">Registries</h1>

          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button className="mb-4">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Registry
              </Button>
            </PopoverTrigger>

            <PopoverContent className="p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-semibold">Create Registry</h2>
                {error && <p className="text-red-500">{error}</p>}

                <div>
                  <label className="block text-lg font-medium">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter registry name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium">User ID</label>
                  <Input
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(Number(e.target.value))}
                    placeholder="Enter user ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium">Event ID</label>
                  <Input
                    type="number"
                    value={eventId}
                    onChange={(e) => setEventId(Number(e.target.value))}
                    placeholder="Enter event ID"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Registry'}
                </Button>
              </form>
            </PopoverContent>
          </Popover>

          <div className="mt-6">
            <Card className="w-full max-w-4xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Registry List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Event ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registries.map((registry) => (
                      <TableRow key={registry.id}>
                        <TableCell>{registry.name}</TableCell>
                        <TableCell>{registry.userId}</TableCell>
                        <TableCell>{registry.eventId}</TableCell>
                        <TableCell className="flex space-x-2">
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteRegistry(registry.id)}>
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                          {/* Add Button in Green */}
                          <Button 
                            className="bg-green-500 hover:bg-green-600 text-white" 
                            size="sm" 
                            onClick={() => handleAddRegistry(registry.id)}
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span className="sr-only">Add</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle className="bg-gray-400" withHandle />

        {/* Right Panel (Gifts Section) */}
        <ResizablePanel className="flex flex-1 bg-white p-6">
          <div className="flex flex-col w-full">
            <h2 className="text-2xl font-bold mb-4">Gifts</h2>
            <div className="flex-1 overflow-auto">
              <Gift />
            </div>
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle className="bg-gray-400" withHandle />
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;
