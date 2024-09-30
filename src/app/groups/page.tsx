"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Input from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Textarea from "@/components/ui/textarea"
import { PlusIcon, UsersIcon, Trash2Icon, SearchIcon, UserPlusIcon, XIcon } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GroupCard from '@/components/ui/GroupCard'
import { useSession } from '@/context/SessionContext'

interface Member {
  id: number
  username: string
  email: string
}

interface Group {
  id: number
  groupName: string
  description: string
  members: Member[]
}

interface NewGroup {
  groupOwnerId: number
  groupName: string
  description: string
  memberIds: number[]
}

export default function GroupPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [newGroup, setNewGroup] = useState<NewGroup>({
    groupOwnerId: 0,
    groupName: '',
    description: '',
    memberIds: []
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [users, setUsers] = useState<{ id: number; username: string }[]>([])

  const session = useSession()
  const userId = session?.user?.id

  const fetchGroupsByUserId = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/v1/groups/user/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch groups')
      }
      const data = await response.json()
      setGroups(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(errorMessage)
      console.error('Fetch error:', error)
    }
  }

  useEffect(() => {
    if (userId) {
      console.log('Fetching groups for user ID:', userId)
      fetchGroupsByUserId(userId)
    } else {
      console.warn('User ID is not defined. Please ensure the session is loaded.')
    }
  }, [userId])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/users')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
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
      const newGroupData = await response.json()
      setGroups([...groups, newGroupData])
      setIsCreateDialogOpen(false)
      setNewGroup({
        groupOwnerId: 0,
        groupName: '',
        description: '',
        memberIds: []
      })
      toast.success('Group created successfully')
    } catch (error: unknown) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unexpected error occurred'
      toast.error(errorMessage)
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
      setGroups((prevGroups) => prevGroups.filter(group => group.id !== groupId))
      toast.success('Group deleted successfully')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(errorMessage)
      console.error('Deletion error:', error)
    }
  }

  const filteredGroups = Array.isArray(groups)
    ? groups.filter(group => {
        const groupNameMatches = group.groupName && group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
        const descriptionMatches = group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase())
        return groupNameMatches || descriptionMatches
      })
    : []

  const handleMemberSelection = (value: string) => {
    const numericValue = parseInt(value, 10)
    if (!isNaN(numericValue) && !newGroup.memberIds.includes(numericValue)) {
      setNewGroup(prev => ({
        ...prev,
        memberIds: [...prev.memberIds, numericValue]
      }))
    }
  }

  const handleRemoveMember = (memberId: number) => {
    setNewGroup(prev => ({
      ...prev,
      memberIds: prev.memberIds.filter(id => id !== memberId)
    }))
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold">Group Management</h1>

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
              <div className="flex flex-wrap gap-2">
                {newGroup.memberIds.map((memberId) => {
                  const user = users.find(u => u.id === memberId)
                  return user ? (
                    <div key={memberId} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
                      {user.username}
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(memberId)}
                        className="ml-2 focus:outline-none"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null
                })}
              </div>
              <Button type="submit">Create Group</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <GroupCard
              key={group.id}
              groupName={group.groupName}
              memberCount={group.members.length}
              onAddPeople={() => console.log(`Add people to ${group.groupName}`)}
              onDeleteGroup={() => handleDeleteGroup(group.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No groups found</div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}
