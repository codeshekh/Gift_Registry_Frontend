'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  Input  from "@/components/ui/input";
import  {Button}  from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon, UserPlusIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import  Textarea  from "@/components/ui/textarea";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Event {
  id: number;
  organizers: string[];
  eventName: string;
  description: string;
  members: string[];
}

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([
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

  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);

  const CreateEventPopover = ({ onClose }: { onClose: () => void }) => {
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
      toast.success('Event created successfully');
      onClose();
    };

    return (
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="eventName"
            placeholder="Event Name"
            value={eventData.eventName}
            onChange={handleChange}
          />
          <Textarea
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
          <div className="flex justify-end space-x-2">
            <Button type="submit">Create Event</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </PopoverContent>
    );
  };

  const AddMemberPopover = ({ onClose }: { onClose: () => void }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (currentEventId !== null) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === currentEventId ? { ...event, members: [...event.members, email.trim()] } : event
          )
        );
        toast.success('Member added successfully');
        setEmail('');
        onClose();
      }
    };

    return (
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter member email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <Button type="submit">Add Member</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </PopoverContent>
    );
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter((event) => event.id !== eventId));
    toast.info('Event deleted');
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
                          <Popover open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setCurrentEventId(event.id);
                                  setIsAddMemberOpen(true);
                                }}
                              >
                                <UserPlusIcon className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <AddMemberPopover onClose={() => setIsAddMemberOpen(false)} />
                          </Popover>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                            <TrashIcon className="h-4 w-4" />
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
          </div>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}