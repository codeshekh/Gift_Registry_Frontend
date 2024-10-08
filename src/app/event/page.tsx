'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon,PencilIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import Textarea from "@/components/ui/textarea";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from '@/context/SessionContext';
interface Event {
  id: number,
  userId: number;
  organizers: number[];
  eventName: string;
  description: string;
  members: number[];
}

export default function EventPage() {
  const session = useSession();
  const userId = session?.user?.id;
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

useEffect(()=>{
  fetchEvents();
},[]);

const fetchEvents = async () => {
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/user/${userId}`);
    console.log(response);
    if(!response.ok){
      throw new Error('Failed to fetch events');
    }
    const data = await response.json();
    setEvents(data.data);
  }
  catch(error){
    console.error('Error Fetching events:',error);
    toast.error('Failed to Fetch Events');
  }
}

  const CreateEventPopover = ({ onClose }: { onClose: () => void }) => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        // Sending a POST request to the backend using Fetch
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/`, {
          
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventName,
            description,
            organizers: [0], // Always send organizers as [0]
            members: [0], // Always send members as [0]
            userId,
          }),
        });
console.log(response+"create");
        if (!response.ok) {
          throw new Error('Failed to create event');
        }

        const responseData = await response.json();

        
        const newEvent:Event = {
          userId: responseData.data.userId, // Accessing userId from data
          id: responseData.data.id, // Accessing the event ID from data
          eventName: responseData.data.eventName, // Accessing the event name from data
          description: responseData.data.description, // Accessing the description from data
          organizers: [0], // Keep this as per your logic
          members: [0], // Keep this as per your logic
        };
        
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        toast.success('Event created successfully');
        setEventName('');
        setDescription('');
        onClose();
      } catch (error) {
        toast.error('Failed to create event');
        console.error(error);
      }
    };

    return (
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="submit">Create Event</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </PopoverContent>
    );
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(events.filter((event) => event.userId !== eventId));
    
      toast.info('Event deleted');
    } catch (error) {
      toast.error('Failed to delete event');
      console.error(error);
    }
  };




const handleModifyEvent =async (eventId: number,updatedData: Partial<Event>) =>{
  try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${eventId}`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    console.log(data);

    if(!response.ok){
      throw new Error('Failed to update event');
    }
setEvents(events.map(event=>event.id===eventId? {...event,...updatedData}:event));

    toast.success('Event updated successfully');
    setEditingEvent(null);
  }catch(error){
    toast.error('Failed to Update Event');
  }
};


const handleEditClick = (event: Event) => {
  setEditingEvent(event); // Set the current event being edited
};

const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (editingEvent) {
    const updatedData = {
      eventName: editingEvent.eventName,
      description: editingEvent.description,
    };
    await handleModifyEvent(editingEvent.id, updatedData);
  }
};

 

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Event Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Popover open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
              <PopoverTrigger asChild>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" /> Create Event
                </Button>
              </PopoverTrigger>
            

              <CreateEventPopover onClose={() => setIsCreateEventOpen(false)} />


            </Popover>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length > 0 ? (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.eventName}</TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditClick(event)}>
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No events available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Event Form */}
      {editingEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit Event</h2>
            <form onSubmit={handleEditSubmit}>
              <Input
                type="text"
                placeholder="Event Name"
                value={editingEvent.eventName}
                onChange={(e) => setEditingEvent({ ...editingEvent, eventName: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description"
                value={editingEvent.description}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                required
              />
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="submit">Update Event</Button>
                <Button variant="outline" onClick={() => setEditingEvent(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
