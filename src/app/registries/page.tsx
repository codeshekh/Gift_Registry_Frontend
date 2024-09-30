"use client"
import { useState, FC } from 'react';
type ViewType = "registry" | "gift" | "details" | "edit" |"giftDetails"; // Add "edit" here


import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, GiftIcon, TrashIcon } from 'lucide-react';

interface Registry {
  id: number;
  name: string;
  userId: number;
  eventId: number;
  gifts: Gift[];
}

interface Gift {
  id: number;
  name: string;
  price: number;
  url: string;
}

const Page: FC = () => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [eventId, setEventId] = useState<number | undefined>(undefined);
  const [giftName, setGiftName] = useState('');
  const [giftURL, setURL] = useState('');
  const [giftPrice, setGiftPrice] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [selectedRegistry, setSelectedRegistry] = useState<Registry | null>(null);
  const [view, setView] = useState<ViewType>("registry"); 
  const [allevent,setevent] = useState<number |undefined>(undefined);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);


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
      const response = await fetch('http://localhost:4000/v1/registries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, userId, eventId }),
      });

      if (response.ok) {
        const data = await response.json();
        setRegistries([...registries, { id: data.id, name, userId, eventId, gifts: [] }]);
        setView('details'); // Consider changing this to a default view that shows the list.
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
      const giftData = {
        giftName,
        giftUrl: giftURL,
        price: giftPrice,
        registryId: selectedRegistry.id,
      };

      const response = await fetch('http://localhost:4000/v1/gifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(giftData),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedRegistry = { ...selectedRegistry };
        updatedRegistry.gifts.push({ id: data.id, name: giftName, price: giftPrice, url: giftURL });

        setRegistries((prevRegistries) =>
          prevRegistries.map((registry) =>
            registry.id === updatedRegistry.id ? updatedRegistry : registry
          )
        );
        setSelectedRegistry(updatedRegistry);
        setView('details');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to add the gift');
      }
    } catch (error) {
      setError('Failed to add the gift');
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (giftURL: string) => {
    if (giftURL) {
      window.open(giftURL, '_blank');
    } else {
      console.log('No URL set for this gift.');
    }
  };

  const handleRegistryClick = (registry: Registry) => {
    setSelectedRegistry(registry);
    setView('details');
  };



//....................................fetch gift details .....................................
const fetchGiftDetails = async (giftId: number) => {
  console.log('Fetching details for gift ID:', giftId);
  setLoading(true);
  setError('');

  try {
    const response = await fetch(`http://localhost:4000/v1/gifts/${giftId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.message || 'Failed to fetch gift details');
      return;
    }

    const data = await response.json();
    setSelectedGift(data);
    setView('giftDetails');
  } catch (error) {
    setError('Failed to fetch gift details');
    console.error('Error fetching gift details:', error);
  } finally {
    setLoading(false);
  }
};




//. ..............................................delete regisrties............................

const handleDeleteRegistry = async (registryId: number) => {
  setLoading(true);
  setError('');

  try {
    const response = await fetch(`http://localhost:4000/v1/registries/${registryId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setRegistries(registries.filter((registry) => registry.id !== registryId));
      setSelectedRegistry(null);
      setView('registry');
    } else {
      const data = await response.json();
      setError(data.message || 'Failed to delete the registry');
    }
  } catch (error) {
    setError('Failed to delete the registry');
  } finally {
    setLoading(false);
  }
};



const handleShowAllRegistries = async () => {
  if (allevent) {
    setLoading(true); // Start loading state
    setError(''); // Clear any previous errors

    try {
      const response = await fetch(`http://localhost:4000/v1/registries/eventRegistry/${allevent}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRegistries(data); // Update registries state with the fetched data
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to fetch registries');
      }
    } catch (error) {
      setError('Failed to fetch registries');
    } finally {
      setLoading(false); // End loading state
    }
  } else {
    setError('Please provide a valid event ID'); // Error handling if allevent is not set
  }
};




// .....................................................update regisrty ..................
const handleUpdateRegistry = async (id: number) => {
  // Ensure that the updated data is valid
  if (!name || eventId === undefined) {
    setError('Name and Event ID are required');
    return;
  }

  const updatedRegistryData = {
    name,
    eventId,
  };

  setLoading(true);
  setError('');

  try {
    const response = await fetch(`http://localhost:4000/v1/registries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRegistryData),
    });

    if (response.ok) {
      const updatedRegistry = await response.json();
      
      // Update the registries state
      setRegistries((prevRegistries) =>
        prevRegistries.map((registry) =>
          registry.id === id ? { ...registry, ...updatedRegistryData } : registry
        )
      );
      setView('details'); // Optionally, you can set the view to show details of the updated registry
    } else {
      const data = await response.json();
      setError(data.message || 'Failed to update the registry');
    }
  } catch (error) {
    setError('Failed to update the registry');
  } finally {
    setLoading(false);
  }
};



return (
  <div className="h-screen flex">
    <ResizablePanelGroup direction={'horizontal'}>
      <ResizablePanel defaultSize={40} className="flex flex-col border-r bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-6">Registries</h1>

        <Button className="mb-4" onClick={() => setView('registry')}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Create New Registry
        </Button>

        <Button className="mb-4 bg-green-500 hover:bg-green-600" onClick={() => setView('gift')} disabled={!selectedRegistry}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Gift
        </Button>

        <div className="mt-6">
          <Input
            type="number"
            value={allevent}
            onChange={(e) => setevent(Number(e.target.value))}
            placeholder="Enter Event ID to filter"
          />
          <Button onClick={handleShowAllRegistries} className="mt-2">
            Show All Registries
          </Button>
        </div>

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
      <TableCell>
        <Button onClick={() => handleDeleteRegistry(registry.id)} className="text-red-500">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </TableCell>
      <TableCell>
        <Button onClick={() => { 
          setSelectedRegistry(registry); 
          setView('edit'); // This ensures the edit form appears
        }} className='text-red-500'>
          <PlusIcon className='h-4 w-4' />
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

      <ResizableHandle className="bg-gray-400" withHandle />

      <ResizablePanel className="flex flex-1 bg-white p-6">
        {view === 'registry' && (
          <form onSubmit={handleRegistrySubmit} className="space-y-4">
            <h2 className="text-2xl font-bold">Create Registry</h2>

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

{view === 'giftDetails' && selectedGift && (
  <div>
    <h2 className="text-2xl font-bold">{selectedGift.name}</h2>
    <p className="text-md">Price: ${selectedGift.price}</p>
    <p className="text-md">URL: {selectedGift.url || 'N/A'}</p>
    <Button onClick={() => handleButtonClick(selectedGift.url)} className="mt-2">
      Visit Gift URL
    </Button>
    <Button onClick={() => setView('details')} className="mt-2">
      Back to Registry
    </Button>
  </div>
)}





{view === 'edit' && selectedRegistry && (
  <form onSubmit={(e) => { 
    e.preventDefault(); 
    handleUpdateRegistry(selectedRegistry.id); 
  }} className="space-y-4">
    <h2 className="text-2xl font-bold">Edit Registry</h2>

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
      {loading ? 'Updating...' : 'Update Registry'}
    </Button>
  </form>
)}


        {view === 'gift' && selectedRegistry && (
          <form onSubmit={handleGiftSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold">Add Gift to {selectedRegistry.name}</h2>

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
              <label className="block text-lg font-medium">Gift URL</label>
              <Input
                value={giftURL}
                onChange={(e) => setURL(e.target.value)}
                placeholder="Enter gift URL"
              />
            </div>
            <div>
              <label className="block text-lg font-medium">Price</label>
              <Input
                type="number"
                value={giftPrice}
                onChange={(e) => setGiftPrice(Number(e.target.value))}
                placeholder="Enter price"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Gift'}
            </Button>
          </form>
        )}

{/* unable to fetch  gift details for perficualr id  */}

{view === 'details' && selectedRegistry && (
  <div>
    <h2 className="text-2xl font-bold">{selectedRegistry.name}</h2>
    <h3 className="text-xl font-semibold">Gifts:</h3>
    {selectedRegistry.gifts && selectedRegistry.gifts.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {selectedRegistry.gifts.map((gift) => (
          <Card key={gift.id} className="p-4 shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{gift.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-md">Price: ${gift.price}</p>
              <Button onClick={() => fetchGiftDetails(gift.id)} className="mt-2">
                View Gift Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <p>No gifts available for this registry.</p>
    )}
  </div>
)}


      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

};

export default Page;
