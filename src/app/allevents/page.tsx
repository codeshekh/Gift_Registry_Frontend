'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, Gift, Users, ChevronDown, ChevronUp, Loader2, Edit, Trash2, Plus, User, Group } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import { useSession } from '@/context/SessionContext'
import 'react-toastify/dist/ReactToastify.css'
import EventComments from '@/components/ui/chatui'
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog"




interface Event {
  id: number
  userId: number
  eventName: string
  description: string
  createdAt: string
  updatedAt: string
  sharedGroup: number
  date: string
  venue: string
  creatorName: string
  role: 'MEMBER' | 'ORGANIZER'
}

interface Registry {
  id: number
  name: string
  userId: number
  eventId: number
  gifts?: Gift[]
}

interface Gift {
  id: number
  giftName: string
  giftUrl: string
  price: number
}
interface Group{
  id: number;
  groupName: string;
  description: string;
}

export default function EventDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventRegistries, setSelectedEventRegistries] = useState<Registry[]>([])
  const [availableRegistries, setAvailableRegistries] = useState<Registry[]>([])
  const [activeTab, setActiveTab] = useState<'your' | 'invited'>('your')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<Group[]>([]);
  const [expandedRegistry, setExpandedRegistry] = useState<number | null>(null)
  const [isAddRegistryOpen, setIsAddRegistryOpen] = useState(false)
  const [selectedRegistry, setSelectedRegistry] = useState<string>('')
  const session = useSession()
  const userId = session?.user?.id
const username = session?.user?.username;
  useEffect(() => {
    if (userId) {
      fetchEvents()
      fetchGroupData()
    }
  }, [userId])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/user/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()

      console.log("event data: ",data);
      if (Array.isArray(data.data)) {
        setEvents(data.data)
      } else {
        console.error('Unexpected response format:', data)
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to fetch events')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const fetchGroupData = async ()=>{
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/groups/user/${userId}`)
if(!response.ok) throw new Error('Failed to fetch Groups');
const data = await response.json();
console.log("group fetched Data",data);
if(Array.isArray(data.data)){
  setGroups(data.data);
}else{
  console.log('Unexpected response formate:',data);
  setGroups([]);
}
    }catch(error){
console.error('Error Fetching Groups:', error);

    }
  }


useEffect(()=>{
  const fetchAvailableRegistries = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/registries/user-registries/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch available registries');
      
      const data = await response.json();
      console.log("Complete API Response:", data); // Log the entire response
      
      // Check if data and data.data are defined
      if (data && Array.isArray(data)) {
        setAvailableRegistries(data);
      } else {
        console.warn("Unexpected response format:", data);
        setAvailableRegistries([]); // Reset state if data is not in expected format
      }
    } catch (error) {
      console.error('Error fetching available registries:', error);
      toast.error('Failed to fetch available registries');
      setAvailableRegistries([]);
    }
  };
  
  fetchAvailableRegistries();
},[]);
  
  const fetchRegistries = async (eventId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/registries/event-registry/${eventId}`)
      if (!response.ok) throw new Error('Failed to fetch registries')
      const data = await response.json()
      console.log(data.data)
      const registriesWithGifts = await Promise.all(data.map(async (registry: Registry) => {
        const gifts = await fetchGifts(registry.id)
        return { ...registry, gifts }
      }))
      setSelectedEventRegistries(registriesWithGifts)
    } catch (error) {
      console.error('Error fetching registries:', error)
      toast.error('Failed to fetch registries')
    }
  }

  const fetchGifts = async (registryId: number): Promise<Gift[]> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gifts/gift-list/${registryId}`)
      if (!response.ok) throw new Error('Failed to fetch gifts')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching gifts:', error)
      toast.error('Failed to fetch gifts')
      return []
    }
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    fetchRegistries(event.id)
  }

  const handleEditEvent = (event: Event) => {
    // Implement edit functionality
    console.log('Edit event:', event)
  }

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/${eventId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete event')
      setEvents(events.filter(event => event.id !== eventId))
      toast.success('Event deleted successfully')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  const handleAddRegistryToEvent = async (registryId: number, registryName: string, userId: number) => {
    if (!selectedEvent) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/registries/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registryName,
          userId: userId,
          eventId: selectedEvent.id,
        }),
      });
      if (!response.ok) throw new Error('Failed to add registry to event');
      toast.success('Registry added to event successfully');
      fetchRegistries(selectedEvent.id);
      setIsAddRegistryOpen(false);
    } catch (error) {
      console.error('Error adding registry to event:', error);
      toast.error('Failed to add registry to event');
    }
  };
  
  

  const filteredEvents = events.filter(event => {
    if (activeTab === 'your') return event.role === 'ORGANIZER'
    if (activeTab === 'invited') return event.role === 'MEMBER'
    return false
  })

  return (
    <div className="w-full min-h-screen p-4 bg-gradient-to-br bg-white">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-800">Event Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedEvent ? (
            <Tabs defaultValue="your" onValueChange={(value) => setActiveTab(value as 'your' | 'invited')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="your">Your Events</TabsTrigger>
                <TabsTrigger value="invited">Invited Events</TabsTrigger>
              </TabsList>
              <TabsContent value="your">
                <EventTable 
                  events={filteredEvents} 
                  onEventClick={handleEventClick} 
                  onEditEvent={handleEditEvent}
                  onDeleteEvent={handleDeleteEvent}
                  loading={loading}
                  groups = {groups}
                />
              </TabsContent>
              <TabsContent value="invited">
                <EventTable 
                  events={filteredEvents} 
                  onEventClick={handleEventClick} 
                  loading={loading}
                  groups = {groups}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <EventDetails 
              event={selectedEvent}
              registries={selectedEventRegistries}
              availableRegistries={availableRegistries}
              onClose={() => setSelectedEvent(null)}
              onAddRegistry={() => setIsAddRegistryOpen(true)}
              userId={userId || 0}
              username={username || ''}
              groups = {groups}
              expandedRegistry={expandedRegistry}
              setExpandedRegistry={setExpandedRegistry}
            />
          )}
        </CardContent>
      </Card>
     

<Dialog open={isAddRegistryOpen} onOpenChange={setIsAddRegistryOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Registry to Event</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      {Array.isArray(availableRegistries) && availableRegistries.length > 0 ? (
        availableRegistries.map((registry) => (
          <div key={registry.id} className="flex justify-between items-center p-2 border-b">
            <div>
              <p className="font-medium">{registry.name}</p>
              <p className="text-sm text-gray-500">{registry.userId} Registry 😁</p>
            </div>
            <Button variant="outline" size="sm" className='bg-orange-500' onClick={() => handleAddRegistryToEvent(registry.id, registry.name, registry.userId)}>
              Add to Event
            </Button>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No registries available</div>
      )}
    </div>
  </DialogContent>
</Dialog>



      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

interface EventTableProps {
  events: Event[]
  onEventClick: (event: Event) => void
  onEditEvent?: (event: Event) => void
  onDeleteEvent?: (eventId: number) => void
  loading: boolean
  groups: Group[]
}

function EventTable({ events, onEventClick, onEditEvent, onDeleteEvent, loading , groups}: EventTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No events found. Create or get invited to an event to see it here.
      </div>
    )
  }

  return (
    <Table >
    <TableHeader>
      <TableRow>
        <TableHead>Event Name</TableHead>
        <TableHead>Group</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
        {events.map(event => {
          const group = groups.find(g => g.id === event.sharedGroup);
          return (
            <TableRow key={event.id} className="hover:bg-amber-50">
              <TableCell className="font-medium">{event.eventName}</TableCell>
              <TableCell>{group ? group.groupName : 'N/A'}</TableCell>
              <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-500 hover:bg-orange-500 hover:text-white"
                  onClick={() => onEventClick(event)}
                >
                  View
                </Button>
                {onEditEvent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:bg-orange-500 hover:text-white"
                    onClick={() => onEditEvent(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDeleteEvent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:bg-orange-500 hover:text-white"
                    onClick={() => onDeleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
  </Table>
  
  )
}

interface EventDetailsProps {
  event: Event
  registries: Registry[]
  availableRegistries: Registry[]
  onClose: () => void
  onAddRegistry: () => void
  userId: number
  username: string
  expandedRegistry: number | null
  setExpandedRegistry: (id: number | null) => void
  groups: Group[]
}

function EventDetails({ 
  event, 
  registries, 
  availableRegistries, 
  onClose, 
  onAddRegistry, 
  userId, 
  username,
  expandedRegistry, 
  setExpandedRegistry ,
  groups
}: EventDetailsProps) {
const group = groups.find(g=>g.id===event.sharedGroup);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-800">{event.eventName}</h2>
        <Button  variant="outline" className='bg-transparent text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white' onClick={onClose}>Back to Events</Button>
      </div>
      <Card>
     <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-amber-700">Event Details</CardTitle>
                                    <div className="grid gap-4 text-base text-gray-600">
  <div className="flex justify-between gap-6">
    <div className='gap-6'>
      <p className="font-semibold">Description:</p>
      <p>{event.description}</p>
    </div>
    <div>
      <p className="font-semibold">Venue:</p>
      <p>{event.venue}</p>
    </div>
    <div>
      <p className="font-semibold">Date:</p>
      <p>{new Date(event.date).toLocaleDateString()}</p>
    </div>
    <div>
      <p className="font-semibold">Group:</p>
      <p>{group ? group.groupName: 'N/A'}</p>
    </div>
    <div>
      <p className="font-semibold">Created by:</p>
      <p>{username}</p>
    </div>
    <div>
      <p className="font-semibold">Created At:</p>
      <p>{new Date(event.createdAt).toLocaleString()}</p>
    </div>
    <div>
      <p className="font-semibold">Your Role:</p>
      <p className="capitalize">{event.role.toLowerCase()}</p>
    </div>
  </div>
</div>

</CardHeader>
       </Card>
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-amber-700">Registries</h3>
          <Button className='bg-transparent text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white' variant="outline" size="sm" onClick={onAddRegistry}>
  <Plus className="h-4 w-4 mr-2 text-white" /> 
  Add Registry
</Button>
        </div>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {registries.map(registry => (
            <div key={registry.id} className="bg-white shadow-sm rounded-lg p-3 mb-3 border border-amber-200">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedRegistry(expandedRegistry === registry.id ? null : registry.id)}>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8 bg-amber-100">
                    <AvatarFallback>
                      <Gift className="h-4 w-4 text-amber-500" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-amber-700">{registry.name}</p>
                    <p className="text-xs text-gray-500">User ID: {registry.userId}</p>
                  </div>
                </div>
                
                {expandedRegistry === registry.id ? <ChevronUp className="h-4 w-4 text-amber-500" /> : <ChevronDown className="h-4 w-4 text-amber-500" />}
              </div>
              {expandedRegistry === registry.id && registry.gifts && (
                <div className="mt-3 pl-11">
                  <h5 className="font-semibold mb-2 text-amber-600">Gifts:</h5>
                  {registry.gifts.length > 0 ? (
                    registry.gifts.map(gift => (
                      <div key={gift.id} className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>{gift.giftName}</span>
                        <span className="text-gray-500">${gift.price.toFixed(2)}</span>
                        {gift.giftUrl && (
                          <a href={gift.giftUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                            View Gift
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No gifts found.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-amber-700 mb-3">Comments</h3>
        <EventComments eventId={event.id} userId={userId}  />
      </div>
    </div>
  )
}