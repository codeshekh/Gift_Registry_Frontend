"use client"
import { useEffect, useState } from 'react'
import Input from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Textarea from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Edit2Icon, PlusIcon, Trash2Icon } from 'lucide-react'
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
  members: { id: number; username: string }[]
  memberCount: number
  id: number
  groupName: string
  description: string
}

export default function GroupPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [userId, setUserId] = useState<number | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
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

  const [newGroup, setNewGroup] = useState<NewGroup>({
    groupOwnerId: 0,
    groupName: '',
    description: '',
    memberIds: []
  })

  useEffect(() => {
    fetchUsers()
    if(userId){
      fetchGroups()
    }
    
  }, [userId])

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

const fetchGroups = async () => {
  try {
    const response = await fetch(`http://localhost:4000/v1/groups/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch groups');
    }
    const data = await response.json();
    setGroups(data.data); // Assuming the API returns a `data` array
  } catch (error) {
    console.error('Error fetching groups:', error);
    toast.error('Failed to fetch groups');
  }
};

  

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

      // Fetch the newly created group
      const createdGroup = await response.json()

      // Assuming the response contains the created group data
      const groupResponse = await fetch(`http://localhost:4000/v1/groups/${createdGroup.data}`)
      if (!groupResponse.ok) {
        throw new Error('Failed to fetch the created group')
      }

      const fetchedGroup = await groupResponse.json() // Get the complete group data

      // Add the fetched group to the state
      setGroups((prev) => Array.isArray(prev) ? [...prev, fetchedGroup] : [fetchedGroup])

      setIsCreateDialogOpen(false)
      setNewGroup({
        groupOwnerId: userId,
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

  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup) return
    try {
      const response = await fetch(`http://localhost:4000/v1/group/${selectedGroup.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupName: selectedGroup.groupName,
          description: selectedGroup.description,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to update group')
      }
      const updatedGroup = await response.json()
      setGroups((prev) => prev.map((group) => group.id === updatedGroup.id ? updatedGroup : group))
      setIsUpdateDialogOpen(false)
      toast.success('Group updated successfully')
    } catch (error) {
      toast.error('Failed to update group')
    }
  }

  const handleMemberSelection = (value: string) => {
    const numericValue = parseInt(value, 10)
    if (!isNaN(numericValue) && !newGroup.memberIds.includes(numericValue)) {
      setNewGroup(prev => ({
        ...prev,
        memberIds: [...prev.memberIds, numericValue]
      }))
    }
  }

  const handleDeleteGroup = async (groupId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/v1/groups/${groupId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete group')
      }
      setGroups((prev) => prev.filter((group) => group.id !== groupId))
      toast.success('Group deleted successfully')
    } catch (error) {
      toast.error('Failed to delete group')
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold">Group Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <CardTitle>{group.groupName}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Members: {group.memberCount}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setSelectedGroup(group)
                setIsUpdateDialogOpen(true)
              }}>
                <Edit2Icon className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteGroup(group.id)}>
                <Trash2Icon className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon className="mr-2" /> Create Group
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={newGroup.groupName}
                onChange={e => setNewGroup({ ...newGroup, groupName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newGroup.description}
                onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="members">Add Members</Label>
              <Select onValueChange={handleMemberSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select members to add" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Create
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateGroup} className="space-y-4">
            <div>
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                value={selectedGroup?.groupName ?? ''}
                onChange={e => setSelectedGroup({ ...selectedGroup!, groupName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={selectedGroup?.description ?? ''}
                onChange={e => setSelectedGroup({ ...selectedGroup!, description: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Update
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  )
}
