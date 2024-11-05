'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import  Input  from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { PlusIcon, Edit, Trash2 } from 'lucide-react'
import { useSession } from '@/context/SessionContext'

interface Registry {
  id: number
  name: string
  eventId: number
}

interface Event {
  id: number
  eventName: string
  eventType: string
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

export default function RegistriesPage() {
  const [registries, setRegistries] = useState<Registry[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isCreateRegistryOpen, setIsCreateRegistryOpen] = useState(false)
  const [isUpdateRegistryOpen, setIsUpdateRegistryOpen] = useState(false)
  const [newRegistry, setNewRegistry] = useState({ name: '', eventId: '' })
  const [updatedRegistry, setUpdatedRegistry] = useState({ id: 0, name: '', eventId: '' })
  const session = useSession()
  const router = useRouter()

  const userId = session?.user?.id

  useEffect(() => {
    fetchRegistries()
    fetchEvents()
  }, [])

  const fetchRegistries = async () => {
    try {
      const response = await fetch(`http://localhost:4000/v1/registries/user-registries/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch registries')
      const data = await response.json()
      setRegistries(data)
    } catch (error) {
      toast.error('Failed to fetch registries')
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:4000/v1/events/user/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data.data)
    } catch (error) {
      toast.error('Failed to fetch events')
    }
  }

  const handleCreateRegistry = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/v1/registries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRegistry.name, userId, eventId: parseInt(newRegistry.eventId) }),
      })
      if (!response.ok) throw new Error('Failed to create registry')
      const data = await response.json()
      setRegistries([...registries, data])
      setIsCreateRegistryOpen(false)
      setNewRegistry({ name: '', eventId: '' })
      toast.success('Registry created successfully')
    } catch {
      toast.error('Failed to create registry')
    }
  }

  const handleUpdateRegistry = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:4000/v1/registries/${updatedRegistry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedRegistry.name, eventId: parseInt(updatedRegistry.eventId) }),
      })
      if (!response.ok) throw new Error('Failed to update registry')
      const data = await response.json()
      setRegistries(registries.map(reg => reg.id === updatedRegistry.id ? data : reg))
      setIsUpdateRegistryOpen(false)
      toast.success('Registry updated successfully')
    } catch {
      toast.error('Failed to update registry')
    }
  }

  const handleDeleteRegistry = async (registryId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/v1/registries/${registryId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete registry')
      setRegistries(registries.filter(reg => reg.id !== registryId))
      toast.success('Registry deleted successfully')
    } catch {
      toast.error('Failed to delete registry')
    }
  }

  return (
    <div className="container mx-auto p-4 mt-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Gift Registries</h1>
        <Dialog open={isCreateRegistryOpen} onOpenChange={setIsCreateRegistryOpen}>
          <DialogTrigger asChild>
            <Button><PlusIcon className="mr-2 h-4 w-4" /> Create Registry</Button>
          </DialogTrigger>
          <DialogContent className="bg-black text-white">
            <DialogHeader><DialogTitle>Create New Registry</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateRegistry} className="space-y-4">
              <Input
                className="bg-gray-800 text-white border-gray-600"
                placeholder="Registry Name"
                value={newRegistry.name}
                onChange={(e) => setNewRegistry({ ...newRegistry, name: e.target.value })}
                required
              />
              <Select value={newRegistry.eventId} onValueChange={(value) => setNewRegistry({ ...newRegistry, eventId: value })}>
                <SelectTrigger className="bg-gray-800 text-white"><SelectValue placeholder="Select Event" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id.toString()}>{event.eventName}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-white text-black hover:bg-gray-200">Create Registry</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {registries.map(registry => {
          const event = events.find(e => e.id === registry.eventId)
          const backgroundClass = event ? getEventTypeBackground(event.eventType) : 'bg-default-photo'
          return (
            <Card key={registry.id} className="hover:shadow-lg transition-shadow bg-white">
              <div className={`h-48 ${backgroundClass}`} />
              <CardContent className="pt-4">
                <div className="flex justify-between items-center">
                  <CardTitle>{registry.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Dialog open={isUpdateRegistryOpen} onOpenChange={setIsUpdateRegistryOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setUpdatedRegistry({ id: registry.id, name: registry.name, eventId: registry.eventId.toString() })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black text-white">
                        <DialogHeader><DialogTitle>Update Registry</DialogTitle></DialogHeader>
                        <form onSubmit={handleUpdateRegistry} className="space-y-4">
                          <Input
                            className="bg-gray-800 text-white border-gray-600"
                            placeholder="Registry Name"
                            value={updatedRegistry.name}
                            onChange={(e) => setUpdatedRegistry({ ...updatedRegistry, name: e.target.value })}
                            required
                          />
                          <Select value={updatedRegistry.eventId} onValueChange={(value) => setUpdatedRegistry({ ...updatedRegistry, eventId: value })}>
                            <SelectTrigger className="bg-gray-800 text-white"><SelectValue placeholder="Select Event" /></SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {events.map(event => (
                                  <SelectItem key={event.id} value={event.id.toString()}>{event.eventName}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Button type="submit" className="bg-white text-black hover:bg-gray-200">Update Registry</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteRegistry(registry.id)}
                      className="bg-white text-black border border-gray-300 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  Event: {event?.eventName}
                </CardDescription>
                <div className="mt-4">
                  <Button onClick={() => router.push(`/registries/${registry.id}`)} className="w-full">
                    View Gifts
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <ToastContainer />
    </div>
  )
}