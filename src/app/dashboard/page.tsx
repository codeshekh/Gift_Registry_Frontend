'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarDays, Gift, Users, X, ChevronDown, ChevronUp } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSession } from '@/context/SessionContext'

interface Event {
  id: number
  userId: number
  eventName: string
  description: string
  createdAt: string
  updatedAt: string
  role: 'organizer' | 'invitee'
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

export default function EventDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventRegistries, setSelectedEventRegistries] = useState<Registry[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'created' | 'invited'>('all')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const session = useSession()
  const userId = session?.user?.id 

  useEffect(() => {
    if(userId){
      fetchEvents()
    }
   
  }, [userId])

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/user/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      console.log('Fetched events:', data); 

      
      if (Array.isArray(data.data)) {
        setEvents(data.data); 
      } else {
        console.error('Unexpected response format:', data);
        setEvents([]); 
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to fetch events')
      setEvents([]); 
    }
  }

  const fetchRegistries = async (eventId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/registries/event-registry/${eventId}`)
      if (!response.ok) throw new Error('Failed to fetch registries')
      const data = await response.json()
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

  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true
    if (activeTab === 'created') return event.role === 'organizer'
    if (activeTab === 'invited') return event.role === 'invitee'
    return false
  })

  return (
    <div className="container mx-auto p-4">
      
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as 'all' | 'created' | 'invited')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="created">Created Events</TabsTrigger>
          <TabsTrigger value="invited">Invited Events</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <EventList 
            events={filteredEvents} 
            onEventClick={handleEventClick} 
          />
        </TabsContent>
        <TabsContent value="created" className="mt-6">
          <EventList 
            events={filteredEvents} 
            onEventClick={handleEventClick} 
          />
        </TabsContent>
        <TabsContent value="invited" className="mt-6">
          <EventList 
            events={filteredEvents} 
            onEventClick={handleEventClick} 
          />
        </TabsContent>
      </Tabs>
      <EventDetailsDialog 
        event={selectedEvent} 
        registries={selectedEventRegistries} 
        onClose={() => setSelectedEvent(null)} 
      />
      <ToastContainer />
    </div>
  )
}

interface EventListProps {
  events: Event[]
  onEventClick: (event: Event) => void
}

function EventList({ events, onEventClick }: EventListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <Card key={event.id} className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onEventClick(event)}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              {event.eventName}
            </CardTitle>
            <CardDescription>{event.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.role === 'organizer' ? 'Organizer' : 'Invitee'}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface EventDetailsDialogProps {
  event: Event | null
  registries: Registry[]
  onClose: () => void
}

function EventDetailsDialog({ event, registries, onClose }: EventDetailsDialogProps) {
  const [expandedRegistry, setExpandedRegistry] = useState<number | null>(null)

  if (!event) return null

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-lg shadow-lg p-6" aria-describedby="event-details-description">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-xl font-bold">{event.eventName}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </DialogHeader>
        <div id="event-details-description" className="mt-2">
          <p className="text-sm text-gray-500">{event.description}</p>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-3 text-lg">Registries</h4>
          <ScrollArea className="h-[300px] w-full rounded-md border bg-gray-50 p-4">
            {registries && registries.length > 0 ? (
              registries.map(registry => (
                <div key={registry.id} className="bg-white shadow-sm rounded-lg p-3 mb-3 border border-gray-200">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedRegistry(expandedRegistry === registry.id ? null : registry.id)}>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <Gift className="h-6 w-6 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium leading-none">{registry.name}</p>
                    </div>
                    {expandedRegistry === registry.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedRegistry === registry.id && (
                    <div className="mt-3 pl-14">
                      <h5 className="font-semibold mb-2">Gifts:</h5>
                      {registry.gifts && registry.gifts.length > 0 ? (
                        registry.gifts.map(gift => (
<div key={gift.id} className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>{gift.giftName}</span>
                            <span className="text-gray-500">${gift.price.toFixed(2)}</span>
                            {gift.giftUrl && (
                              <a href={gift.giftUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
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
              ))
            ) : (
              <div className="text-sm text-gray-500">No registries found for this event.</div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
