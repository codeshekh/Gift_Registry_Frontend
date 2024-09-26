'use client';

import { useState, FC } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'; 
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; 

const EventPage: FC = () => {
  
  const [events, setEvents] = useState([
    {
      id: 1,
      userId: 1,
      eventName: 'Tech Conference',
      description: 'A conference about the latest in technology.',
      organizers: [1, 2],
      members: [3, 4],
    },
    {
      id: 2,
      userId: 2,
      eventName: 'Music Festival',
      description: 'A festival featuring various artists.',
      organizers: [3],
      members: [1, 2, 5],
    },
    {
      id: 3,
      userId: 3,
      eventName: 'Art Exhibition',
      description: 'An exhibition showcasing local artists.',
      organizers: [2, 4],
      members: [1, 3],
    },
  ]);

  
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [message, setMessage] = useState('');

  interface CreateEventPopoverProps {
    onClose: () => void;
  }

  const CreateEventPopover: FC<CreateEventPopoverProps> = ({ onClose }) => {
    const [eventData, setEventData] = useState({
      userId: 0,
      eventName: '',
      description: '',
      organizers: [] as number[],
      members: [] as number[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEventData((prevData) => ({
        ...prevData,
        [name]: name === 'userId' ? Number(value) : value,
      }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const values = e.target.value.split(',').map(Number);
      setEventData({ ...eventData, [e.target.name]: values });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const newEvent = {
        id: events.length + 1, 
        ...eventData,
      };

      
      setEvents((prevEvents) => [...prevEvents, newEvent]);

      setMessage('Event created successfully');
      onClose(); 
    };

    return (
      <PopoverContent className="p-6 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="userId" className="text-sm font-medium text-gray-700">User ID</label>
            <input
              type="number"
              name="userId"
              placeholder="User ID"
              value={eventData.userId || ''}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="eventName" className="text-sm font-medium text-gray-700">Event Name</label>
            <input
              type="text"
              name="eventName"
              placeholder="Event Name"
              value={eventData.eventName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={eventData.description}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="organizers" className="text-sm font-medium text-gray-700">Organizers (comma-separated IDs)</label>
            <input
              type="text"
              name="organizers"
              placeholder="Organizers (comma-separated IDs)"
              value={eventData.organizers.join(',')}
              onChange={handleArrayChange}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="members" className="text-sm font-medium text-gray-700">Members (comma-separated IDs)</label>
            <input
              type="text"
              name="members"
              placeholder="Members (comma-separated IDs)"
              value={eventData.members.join(',')}
              onChange={handleArrayChange}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Event
          </button>
        </form>
        <button onClick={onClose} className="mt-4 text-red-500">Close</button>
      </PopoverContent>
    );
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div>
        <h1 className="text-2xl font-bold my-4">Events</h1>

        {/* Create Event Button centered */}
        <div className="flex justify-center mb-4">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger>
              <button
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                className="py-2 px-4 bg-indigo-600 text-white rounded-md"
              >
                Create Event
              </button>
            </PopoverTrigger>
            {isPopoverOpen && <CreateEventPopover onClose={() => setIsPopoverOpen(false)} />}
          </Popover>
        </div>

        {/* Cards displayed below the button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="bg-white border border-gray-300 rounded-lg shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{event.eventName}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Organizers: {event.organizers.join(', ')}</p>
                  <p className="text-sm text-gray-500">Members: {event.members.join(', ')}</p>
                  <button
                    className="mt-4 py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete Event
                  </button>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default EventPage;
