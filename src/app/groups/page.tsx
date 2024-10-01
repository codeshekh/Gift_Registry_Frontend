"use client"
import { useEffect, useState } from 'react'
import Input from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Textarea from "@/components/ui/textarea"
import { PlusIcon } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSession } from '@/context/SessionContext'

interface NewGroup {
  groupOwnerId: number
  groupName: string
  description: string
  memberIds: number[]
}

interface User {
  id: number
  username: string
}

interface Group {
  id: number
  groupName: string
  description: string
}

export default function GroupPage() {
  const [newGroup, setNewGroup] = useState<NewGroup>({
    groupOwnerId: 0,
    groupName: '',
    description: '',
    memberIds: []
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [userId, setUserId] = useState<number | null>(null)
  const session = useSession()

  // Fetch userId from session or localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(Number(storedUserId))
    } else if (session?.user?.id) {
      setUserId(session.user.id)
      localStorage.setItem('userId', String(session.user.id))
    }
  }, [session])

  // Fetch users to populate the select dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/users')
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const usersData = await response.json()
        setUsers(usersData)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
        toast.error(errorMessage)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:4000/v1/groups/user/4`)
        if (!response.ok) {
          throw new Error('Failed to Fetch groups')
        }
        const groupsData = await response.json()
        setGroups(groupsData)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error';
        toast.error(errorMessage);
      }
    }
    fetchGroups()
  }, [userId]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) {
      toast.error('User ID is not defined')
      return
    }
    try {
      const response = await fetch('http://localhost:4000/v1/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newGroup,
          groupOwnerId: userId
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to create group')
      }
      setIsCreateDialogOpen(false)
      setNewGroup({
        groupOwnerId: 0,
        groupName: '',
        description: '',
        memberIds: []
      })
      toast.success('Group created successfully')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(errorMessage)
    }
  }

  // Handle member selection for the new group
  const handleMemberSelection = (value: string) => {
    const numericValue = parseInt(value, 10)
    if (!isNaN(numericValue) && !newGroup.memberIds.includes(numericValue)) {
      setNewGroup(prev => ({
        ...prev,
        memberIds: [...prev.memberIds, numericValue]
      }))
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold">Group Management</h1>

      {/* Display the list of groups */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Groups</h2>
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div key={group.id} className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg">{group.groupName}</h3>
                <p className="text-gray-600">{group.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No groups found. Create a new group!</p>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" /> Create Group
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={newGroup.groupName}
                onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })}
                placeholder="Enter group name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                placeholder="Enter group description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="members">Select Members</Label>
              <Select onValueChange={handleMemberSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select members" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Create Group</Button>
          </form>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  )
}
