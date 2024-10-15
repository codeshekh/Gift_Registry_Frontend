'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from '@/components/ui/button'
import  Input from '@/components/ui/input'
import  Textarea  from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon, Gift, Trash2, ExternalLink } from 'lucide-react'
import { useSession } from '@/context/SessionContext'

const eventTypes = ['BIRTHDAY', 'WEDDING', 'ANNIVERSARY', 'BABY_SHOWER', 'OTHER']

interface Event {
  id: number
  eventName: string
  description: string
  eventType: string
  venue: string
  date: string
  sharedGroup: number
  organizers?: string[];
  members?: string[];
}

interface Registry {
  id: number
  name: string
  eventId: number
}

interface Gift {
  id: number
  giftName: string
  price: number
  giftUrl: string
  registryId: number
}

interface Group {
  id: number
  groupName: string
}

export default function EventRegistryCreator() {
  const router = useRouter()
  const session = useSession()
  const [event, setEvent] = useState<Event | null>(null)
  const [registry, setRegistry] = useState<Registry | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(true)
  const [newGift, setNewGift] = useState({ giftName: '', giftUrl: '', price: '' })

  const [newEvent, setNewEvent] = useState({
    eventName: '',
    description: '',
    eventType: '',
    venue: '',
    date: '',
    groupId: ''
  })

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/groups/user/${session?.user?.id}`)
      if (!response.ok) throw new Error('Failed to fetch groups')
      const data = await response.json()
    console.log(data);
      setGroups(data.data)
    } catch (error) {
      console.error('Error fetching groups:', error)
      toast.error('Failed to fetch groups')
    }
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEvent,
          groupId: newEvent.groupId === 'none' ? null : parseInt(newEvent.groupId),
          userId: session?.user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      const responseData = await response.json()
      setEvent(responseData.data)
      toast.success('Event created successfully')
      createRegistry(responseData.data.id)
      setIsCreateEventOpen(false)
    } catch (error) {
      toast.error('Failed to create event')
      console.error(error)
    }
  }

  const createRegistry = async (eventId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/registries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${newEvent.eventName} Registry`,
          userId: session?.user?.id,
          eventId: eventId
        }),
      })
      if (!response.ok) throw new Error('Failed to create registry')
      const data = await response.json()
      setRegistry(data)
      toast.success('Registry created successfully')
    } catch (error) {
      console.error('Error creating registry:', error)
      toast.error('Failed to create registry')
    }
  }

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registry) return
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gifts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftName: newGift.giftName,
          giftUrl: newGift.giftUrl,
          price: parseFloat(newGift.price),
          registryId: registry.id,
        }),
      })
      if (!response.ok) throw new Error('Failed to add gift')
      const data = await response.json()
      setGifts([...gifts, data])
      setIsAddGiftOpen(false)
      setNewGift({ giftName: '', giftUrl: '', price: '' })
      toast.success('Gift added successfully')
    } catch (error) {
      console.error('Error adding gift:', error)
      toast.error('Failed to add gift')
    }
  }

  const handleDeleteGift = async (giftId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gifts/${giftId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete gift')
      setGifts(gifts.filter(gift => gift.id !== giftId))
      toast.success('Gift deleted successfully')
    } catch (error) {
      console.error('Error deleting gift:', error)
      toast.error('Failed to delete gift')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create Event and Registry</h1>
      
      <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <Input
              placeholder="Event Name"
              value={newEvent.eventName}
              onChange={(e) => setNewEvent({ ...newEvent, eventName: e.target.value })}
              required
            />
            <Textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              required
            />
            <Select
              value={newEvent.eventType}
              onValueChange={(value) => setNewEvent({ ...newEvent, eventType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Event Type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Venue"
              value={newEvent.venue}
              onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
              required
            />
            <Input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
            <Select
              value={newEvent.groupId}
              onValueChange={(value) => setNewEvent({ ...newEvent, groupId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Group</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.groupName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Create Event and Registry</Button>
          </form>
        </DialogContent>
      </Dialog>

      {event && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Event Name:</strong> {event.eventName}</p>
              <p><strong>Description:</strong> {event.description}</p>
              <p><strong>Type:</strong> {event.eventType}</p>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Group:</strong>{event.sharedGroup ? groups.length > 0 && groups.find(g => g.id === event.sharedGroup)?.groupName : 'No Group'}
              </p>
              <p><strong>Created By:</strong> {session?.user?.username}</p>
              <p><strong>Creator Email:</strong> {session?.user?.email}</p>
            </CardContent>
          </Card>

          {registry && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Registry: {registry.name}</h3>
              <Dialog open={isAddGiftOpen} onOpenChange={setIsAddGiftOpen}>
                <DialogTrigger asChild>
                  <Button className="mb-4">
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Gift
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Gift</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddGift} className="space-y-4">
                    <Input
                      placeholder="Gift Name"
                      value={newGift.giftName}
                      onChange={(e) => setNewGift({ ...newGift, giftName: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Gift URL"
                      value={newGift.giftUrl}
                      onChange={(e) => setNewGift({ ...newGift, giftUrl: e.target.value })}
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      value={newGift.price}
                      onChange={(e) => setNewGift({ ...newGift, price: e.target.value })}
                      required
                    />
                    <Button type="submit">Add Gift</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gifts.map((gift) => (
                  <Card key={gift.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Gift className="mr-2 h-5 w-5" /> {gift.giftName}
                      </CardTitle>
                      <CardDescription>${gift.price.toFixed(2)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={gift.giftUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        View Gift <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteGift(gift.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  )
}