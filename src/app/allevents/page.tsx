'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import GiftComponent from '@/components/ui/gift-registry';
import {  Gift,  Loader2, Edit, Trash2, Share2 } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import { useSession } from '@/context/SessionContext';
import 'react-toastify/dist/ReactToastify.css';
import EventComments from '@/components/ui/chatui';
import './styles.css';

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
  eventType: string
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
  giftStatus: boolean
}

interface Group {
  id: number
  groupName: string
  description: string
}

const getEventTypeBackground = (eventType: string) => {
  switch (eventType) {
    case 'BIRTHDAY':
      return 'bg-birthday-photo bg-cover bg-center'
    case 'WEDDING':
      return 'bg-wedding-photo bg-cover bg-center'
    case 'ANNIVERSARY':
      return 'bg-anniversary-photo bg-cover bg-center'
    case 'BABY_SHOWER':
      return 'bg-babyshower-photo bg-cover bg-center'
    default:
      return 'bg-default-photo bg-cover bg-center'
  }
}

export default function Component() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventRegistries, setSelectedEventRegistries] = useState<Registry[]>([])
  const [activeTab, setActiveTab] = useState<'your' | 'invited'>('your')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<Group[]>([])
  const session = useSession()
  const userId = session?.user?.id || 0
  const username = session?.user?.username || ''

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

  const fetchGroupData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/groups/user/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch Groups')
      const data = await response.json()
      if (Array.isArray(data.data)) {
        setGroups(data.data)
      } else {
        console.log('Unexpected response format:', data)
        setGroups([])
      }
    } catch (error) {
      console.error('Error Fetching Groups:', error)
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

  const handleEditEvent = (event: Event) => {
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

  const handleBuyGift = async (giftId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gifts/${giftId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giftStatus: true
        }),
      })
      if (!response.ok) throw new Error('Failed to update gift status')
      
      setSelectedEventRegistries((prevRegistries) =>
        prevRegistries.map((registry) => ({
          ...registry,
          gifts: registry.gifts?.map((gift) =>
            gift.id === giftId ? { ...gift, giftStatus: true } : gift
          ),
        }))
      )
      
      toast.success('Gift marked as purchased')
    } catch (error) {
      console.error('Error updating gift status:', error)
      toast.error('Failed to update gift status')
    }
  }

  const filteredEvents = events.filter(event => {
    if (activeTab === 'your') return event.role === 'ORGANIZER'
    if (activeTab === 'invited') return event.role === 'MEMBER'
    return false
  })

  return (
    <div className="w-full min-h-screen p-4 bg-gradient-to-br bg-white">
      <div className="w-full max-w-4xl mx-auto mt-7">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-amber-800">Event Management</h1>
          <div>
            <Button
              variant="outline"
              className={`mr-2 ${activeTab === 'your' ? 'bg-amber-500 text-white' : ''}`}
              onClick={() => setActiveTab('your')}
            >
              Your Events
            </Button>
            <Button
              variant="outline"
              className={activeTab === 'invited' ? 'bg-amber-500 text-white' : ''}
              onClick={() => setActiveTab('invited')}
            >
              Invited Events
            </Button>
          </div>
        </div>

        {!selectedEvent ? (
          <EventTable 
            events={filteredEvents} 
            onEventClick={handleEventClick} 
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            loading={loading}
            groups={groups}
          />
        ) : (
          <EventDetails 
            event={selectedEvent}
            registries={selectedEventRegistries}
            onClose={() => setSelectedEvent(null)}
            userId={userId}
            username={username}
            groups={groups}
            onBuyGift={handleBuyGift}
          />
        )}
      </div>

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

function EventTable({ events, onEventClick, onEditEvent, onDeleteEvent, loading, groups }: EventTableProps) {
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
    <Table>
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
          const group = groups.find(g => g.id === event.sharedGroup)
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
interface EventDetailsProps {
  event: Event
  registries: Registry[]
  onClose: () => void
  userId: number
  username: string
  groups: Group[]
  onBuyGift: (giftId: number) => Promise<void>
}

function EventDetails({ 
  event, 
  registries, 
  onClose, 
  userId, 
  username,
  groups,
  onBuyGift,
}: EventDetailsProps) {
  const group = groups.find(g => g.id === event.sharedGroup)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-800">{event.eventName}</h2>
        <Button 
          variant="outline" 
          className='bg-transparent text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white' 
          onClick={onClose}
        >
          Back to Events
        </Button>
      </div>

      <div className={`${getEventTypeBackground(event.eventType)} p-4 rounded-lg`}>
        <h3 className="text-lg font-semibold text-amber-700 mb-2">Event Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Description:</p>
            <p className='text-black font-serif'>{event.description}</p>
            <p className="font-semibold mt-2">Venue:</p>
            <p>{event.venue}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-semibold">Date:</p>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold">Group:</p>
              <p>{group ? group.groupName : 'N/A'}</p>
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
      </div>

      <div>
        <h3 className="text-lg font-semibold text-amber-700 mb-3">Gifts</h3>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {registries.map(registry => (
            <div key={registry.id} className="mb-4">
              <h4 className="font-medium text-amber-700 mb-2">{registry.name}</h4>
              <GiftComponent 
                registryId={registry.id} 
                onBuyGift={onBuyGift} 
              />
            </div>
          ))}
        </ScrollArea>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-amber-700 mb-3">Comments</h3>
        <EventComments eventId={event.id} userId={userId} />
      </div>
    </div>
  )
}