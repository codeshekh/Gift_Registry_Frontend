'use client';

import { useState, FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  Input  from "@/components/ui/input";
import  Button  from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

const EventPage: FC = () => {
  const [events, setEvents] = useState<{
    id: number;
    organizers: string[];
    eventName: string;
    description: string;
    members: string[];
  }[]>([
    {
      id: 1,
      organizers: ['organizer1@example.com', 'organizer2@example.com'],
      eventName: 'Tech Conference',
      description: 'A conference about the latest in technology.',
      members: ['member3@example.com', 'member4@example.com'],
    },
    {
      id: 2,
      organizers: ['organizer3@example.com'],
      eventName: 'Music Festival',
      description: 'A festival featuring various artists.',
      members: ['member1@example.com', 'member2@example.com', 'member5@example.com'],
    },
    {
      id: 3,
      organizers: ['organizer2@example.com', 'organizer4@example.com'],
      eventName: 'Art Exhibition',
      description: 'An exhibition showcasing local artists.',
      members: ['member1@example.com', 'member3@example.com'],
    },
  ]);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAddMemberPopoverOpen, setIsAddMemberPopoverOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  interface CreateEventPopoverProps {
    onClose: () => void;
  }

  const CreateEventPopover: FC<CreateEventPopoverProps> = ({ onClose }) => {
    const [eventData, setEventData] = useState({
      eventName: '',
      description: '',
      organizers: [] as string[],
      members: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEventData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const values = e.target.value.split(',').map((email) => email.trim());
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="eventName"
            placeholder="Event Name"
            value={eventData.eventName}
            onChange={handleChange}
          />
          <Input
            alt="textarea"
            name="description"
            placeholder="Description"
            value={eventData.description}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="organizers"
            placeholder="Organizers (comma-separated emails)"
            value={eventData.organizers.join(', ')}
            onChange={handleArrayChange}
          />
          <Input
            type="text"
            name="members"
            placeholder="Members (comma-separated emails)"
            value={eventData.members.join(', ')}
            onChange={handleArrayChange}
          />
          <Button type="submit">
            Create Event
          </Button>
        </form>
        <Button variant="destructive" onClick={onClose}>
          Close
        </Button>
      </PopoverContent>
    );
  };

  const AddMemberPopover: FC<CreateEventPopoverProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (currentEventId !== null) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === currentEventId ? { ...event, members: [...event.members, email.trim()] } : event
          )
        );
        setMessage('Member added successfully');
        setEmail('');
        onClose();
      }
    };

    return (
      <PopoverContent className="p-6 bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter member email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Add Member</Button>
        </form>
        <Button variant="destructive" onClick={onClose}>
          Close
        </Button>
      </PopoverContent>
    );
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleRegisterEvent = (eventId: number) => {
    setMessage(`Registered for event with ID: ${eventId}`);
  };

  return (
    <Card className="flex flex-col min-h-screen justify-between">
      <CardContent className="mt-2">
        <div className="flex justify-between mb-4">
          <Button onClick={() => setIsPopoverOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" /> Create Event
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Organizers</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.eventName}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{event.organizers.join(', ')}</TableCell>
                  <TableCell>{event.members.join(', ')}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setCurrentEventId(event.id);
                          setIsAddMemberPopoverOpen(true);
                        }}
                      >
                        Add Member
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No events available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Popover for creating events */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <CreateEventPopover onClose={() => setIsPopoverOpen(false)} />
      </Popover>

      {/* Popover for adding members */}
      <Popover open={isAddMemberPopoverOpen} onOpenChange={setIsAddMemberPopoverOpen}>
        <AddMemberPopover onClose={() => setIsAddMemberPopoverOpen(false)} />
      </Popover>

      {/* Message Display */}
      {message && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md">
          {message}
        </div>
      )}
    </Card>
  );
};

export default EventPage;
