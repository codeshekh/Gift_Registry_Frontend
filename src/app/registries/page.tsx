"use client"
import { useState, FC } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon, GiftIcon, CalendarIcon, MapPinIcon } from 'lucide-react';

// Mock event details
const eventDetails = {
  title: "Sarah's Birthday Celebration",
  date: "September 15, 2024",
  location: "Central Park, New York City",
};

const Page: FC = () => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [eventId, setEventId] = useState<number | undefined>(undefined);
  const [giftName, setGiftName] = useState('');
  const [giftPrice, setGiftPrice] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registries, setRegistries] = useState([
    { id: 1, name: 'Default Registry 1', userId: 1, eventId: 101, gifts: [{ id: 1, name: 'Leather Handbag', price: 129.99 }] },
    { id: 2, name: 'Default Registry 2', userId: 2, eventId: 102, gifts: [{ id: 2, name: 'Wireless Headphones', price: 199.99 }] },
  ]);
  const [selectedRegistry, setSelectedRegistry] = useState<any>(null);
  const [view, setView] = useState<'registry' | 'gift' | 'details'>('details');

  const handleRegistrySubmit = async (e: React.FormEvent) => {
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
        setRegistries([...registries, { id: data.id, name, userId, eventId, gifts: [] }]);
        setView('details');
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

  const handleGiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!giftName || giftPrice === undefined || !selectedRegistry) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const updatedRegistry = { ...selectedRegistry };
      updatedRegistry.gifts.push({ id: Date.now(), name: giftName, price: giftPrice });

      // Simulate an API call to add the gift to the registry
      setRegistries((prevRegistries) =>
        prevRegistries.map((registry) =>
          registry.id === updatedRegistry.id ? updatedRegistry : registry
        )
      );
      setSelectedRegistry(updatedRegistry);
      setView('details');
    } catch (error) {
      setError('Failed to add the gift');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistryClick = (registry: any) => {
    setSelectedRegistry(registry);
    setView('details');
  };

  return (
    <div className="h-screen flex">
      <ResizablePanelGroup direction={'horizontal'}>
        {/* Left Panel (Registries Section) */}
        <ResizablePanel defaultSize={40} className="flex flex-col border-r bg-gray-50 p-6">
          <h1 className="text-2xl font-bold mb-6">Registries</h1>

          {/* Create Registry Button */}
          <Button className="mb-4" onClick={() => setView('registry')}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create New Registry
          </Button>

          {/* Create Gift Button */}
          <Button className="mb-4 bg-green-500 hover:bg-green-600" onClick={() => setView('gift')} disabled={!selectedRegistry}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Gift
          </Button>

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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registries.map((registry) => (
                      <TableRow key={registry.id} onClick={() => handleRegistryClick(registry)} className="cursor-pointer">
                        <TableCell>{registry.name}</TableCell>
                        <TableCell>{registry.userId}</TableCell>
                        <TableCell>{registry.eventId}</TableCell>
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

        {/* Right Panel (Form or Details) */}
        <ResizablePanel className="flex flex-1 bg-white p-6">
          {view === 'registry' && (
            <form onSubmit={handleRegistrySubmit} className="space-y-4">
              <h2 className="text-2xl font-bold">Create Registry</h2>
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
          )}

          {view === 'gift' && selectedRegistry && (
            <form onSubmit={handleGiftSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold">Add Gift to {selectedRegistry.name}</h2>
              {error && <p className="text-red-500">{error}</p>}

              <div>
                <label className="block text-lg font-medium">Gift Name</label>
                <Input
                  value={giftName}
                  onChange={(e) => setGiftName(e.target.value)}
                  placeholder="Enter gift name"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium">Gift Price</label>
                <Input
                  type="number"
                  value={giftPrice}
                  onChange={(e) => setGiftPrice(Number(e.target.value))}
                  placeholder="Enter gift price"
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Gift'}
              </Button>
            </form>
          )}

          {view === 'details' && selectedRegistry && (
            <div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl font-bold">{eventDetails.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                      <span>{eventDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                      <span>{eventDetails.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h2 className="text-2xl font-bold mb-4">Registry Details</h2>
              <p><strong>Name:</strong> {selectedRegistry.name}</p>
              <p><strong>User ID:</strong> {selectedRegistry.userId}</p>
              <p><strong>Event ID:</strong> {selectedRegistry.eventId}</p>

              <h3 className="text-xl font-semibold mt-4">Gifts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {selectedRegistry.gifts.length > 0 ? (
                  selectedRegistry.gifts.map((gift: any) => (
                    <Card key={gift.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{gift.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold">${gift.price?.toFixed(2) || 'N/A'}</span>
                          <Button variant="outline" size="sm">
                            <GiftIcon className="h-4 w-4 mr-2" />
                            Select Gift
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No gifts in this registry.</p>
                )}
              </div>
            </div>
          )}
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle className="bg-gray-400" withHandle />
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;
