'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CalendarDays, Gift, Users, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify'
import { useSession } from '@/context/SessionContext'
import 'react-toastify/dist/ReactToastify.css'

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
  const [loading, setLoading] = useState(true)
  const session = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    fetchEvents()
  }, [userId])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/events/user/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      
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
    
    
  

    <div className="w-full h-screen p-4 bg-gradient-to-br from-amber-100 to-amber-300">
      
      {/* <h1 className="text-4xl font-bold text-amber-800 mb-8 text-center">Event Dashboard</h1> */}
      <Tabs defaultValue="all" className="w-full max-w-4xl mx-auto" onValueChange={(value) => setActiveTab(value as 'all' | 'created' | 'invited')}>
        <TabsList className="grid w-full grid-cols-3 bg-amber-50 rounded-lg p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-white">All Events</TabsTrigger>
          <TabsTrigger value="created" className="data-[state=active]:bg-white">Created Events</TabsTrigger>
          <TabsTrigger value="invited" className="data-[state=active]:bg-white">Invited Events</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <EventList 
            events={filteredEvents} 
            onEventClick={handleEventClick} 
            loading={loading}
          />
        </TabsContent>
        <TabsContent value="created" className="mt-6">
          <EventList 
            events={filteredEvents} 
            onEventClick={handleEventClick} 
            loading={loading}
          />
        </TabsContent>
        <TabsContent value="invited" className="mt-6">
          <EventList 
            events={filteredEvents} 
            onEventClick={handleEventClick} 
            loading={loading}
          />
        </TabsContent>
      </Tabs>
      <EventDetailsDialog 
        event={selectedEvent} 
        registries={selectedEventRegistries} 
        onClose={() => setSelectedEvent(null)} 
      />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

interface EventListProps {
  events: Event[]
  onEventClick: (event: Event) => void
  loading: boolean
}

function EventList({ events, onEventClick, loading }: EventListProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <Card key={event.id} className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-semibold text-amber-700">
              <CalendarDays className="mr-2 h-5 w-5" />
              {event.eventName}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">{event.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pt-2">
            <div className="flex items-center space-x-2 text-sm text-amber-600">
              <Users className="h-4 w-4" />
              <span>{event.role === 'organizer' ? 'Organizer' : 'Invitee'}</span>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 w-full bg-amber-50 hover:bg-amber-100 text-amber-700"
              onClick={() => onEventClick(event)}
            >
              View Details
            </Button>
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
      <DialogContent className="sm:max-w-[600px] bg-white rounded-lg shadow-lg p-6">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-amber-800">{event.eventName}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </DialogHeader>
        <div className="mt-2">
          <p className="text-sm text-gray-600">{event.description}</p>
        </div>
        <div className="mt-6">
          <h4 className="font-semibold mb-3 text-lg text-amber-700">Registries</h4>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {registries && registries.length > 0 ? (
              registries.map(registry => (
                <div key={registry.id} className="bg-white shadow-sm rounded-lg p-3 mb-3 border border-amber-200">
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedRegistry(expandedRegistry === registry.id ? null : registry.id)}>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10 bg-amber-100">
                        <AvatarFallback>
                          <Gift className="h-6 w-6 text-amber-500" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium leading-none text-amber-700">{registry.name}</p>
                    </div>
                    {expandedRegistry === registry.id ? <ChevronUp className="h-4 w-4 text-amber-500" /> : <ChevronDown className="h-4 w-4 text-amber-500" />}
                  </div>
                  {expandedRegistry === registry.id && (
                    <div className="mt-3 pl-14">
                      <h5 className="font-semibold mb-2 text-amber-600">Gifts:</h5>
                      {registry.gifts && registry.gifts.length > 0 ? (
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