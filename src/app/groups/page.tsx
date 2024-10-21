'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Input from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, TrashIcon, PencilIcon, UsersIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Textarea from "@/components/ui/textarea"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from '@/context/SessionContext'

interface Group {
  id: number
  userId: number
  groupName: string
  description: string
  memberIds: number[]
  members?: User[]
}

interface User {
  id: number
  email: string
  username: string
}

interface UpdateGroupDto {
  groupName: string
  description: string
  newMembers: number[]
  removedMembers: number[]
}

export default function GroupManager() {
  const session = useSession()
  const userId = session?.user?.id

  const [groups, setGroups] = useState<Group[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false)
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([])
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  useEffect(() => {
    if (userId) {
      fetchGroups()
      fetchAllUsers()
    }
  }, [userId])

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/groups/user/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch groups')
      const data = await response.json()
      setGroups(data.data)
    } catch (error) {
      console.error('Error Fetching groups:', error)
      toast.error('Failed to Fetch Groups')
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/all`)
      if (!response.ok) throw new Error('Failed to Fetch Users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error Fetching users:', error)
      toast.error('Failed to Fetch Users')
    }
  }

  const handleMemberSelect = (userId: number) => {
    setSelectedMemberIds(prev => {
      // Fallback to an empty array if prev is undefined
      const currentSelectedIds = prev || [];
      return currentSelectedIds.includes(userId)
        ? currentSelectedIds.filter(id => id !== userId)
        : [...currentSelectedIds, userId];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/groups/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName,
          description,
          memberIds: selectedMemberIds,
          groupOwnerId: userId,
        }),
      })
      if (!response.ok) throw new Error('Failed to create group')
      const responseData = await response.json()
      if (responseData && responseData.data) {
        const newGroup: Group = {
          id: responseData.data,
          userId: userId!,
          groupName,
          description,
          memberIds: selectedMemberIds,
        }
        setGroups(prevGroups => [...prevGroups, newGroup])
        toast.success('Group created successfully')
        resetForm()
      } else {
        throw new Error('Unexpected response structure')
      }
    } catch (error) {
      toast.error('Failed to create group')
      console.error('Error creating group:', error)
    }
  }

  const resetForm = () => {
    setGroupName('')
    setDescription('')
    setSelectedMemberIds([])
    setIsCreateGroupOpen(false)
    setIsEditGroupOpen(false)
    setEditingGroup(null)
  }

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group)
    setGroupName(group.groupName)
    setDescription(group.description)
    setSelectedMemberIds(group.memberIds)
    setIsEditGroupOpen(true)
  }

  const handleShowGroupMembers = (group: Group) => {
    fetchGroupDetails(group.id)
    setSelectedGroup(group)
  }

  const handleDeleteGroup = async (groupId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete group')
      setGroups(groups.filter(group => group.id !== groupId))
      toast.info('Group deleted')
    } catch (error) {
      toast.error('Failed to delete group')
      console.error(error)
    }
  }

  const fetchGroupDetails = async (groupId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${groupId}`)
      if (!response.ok) throw new Error('Failed to fetch group details')
      const data = await response.json()
      setSelectedGroup({ ...data.data, members: data.data.members || [] })
    } catch (error) {
      console.error('Error fetching group details:', error)
      toast.error('Failed to fetch group details')
    }
  }

  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGroup) return
    try {
      const currentMemberIds = editingGroup.memberIds || []
      const newMembers = selectedMemberIds.filter(id => !currentMemberIds.includes(id))
      const removedMembers = currentMemberIds.filter(id => !selectedMemberIds.includes(id))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/groups/${editingGroup.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName,
          description,
          newMembers,
          removedMembers,
        } as UpdateGroupDto),
      })
      if (!response.ok) throw new Error('Failed to update group')
      const updatedGroup: Group = {
        ...editingGroup,
        groupName,
        description,
        memberIds: selectedMemberIds,
      }
      setGroups(prevGroups =>
        prevGroups.map(group =>
          group.id === editingGroup.id ? updatedGroup : group
        )
      )
      toast.success('Group updated successfully')
      resetForm()
    } catch (error) {
      toast.error('Failed to update group')
      console.error('Error updating group:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Group Manager</h1>
        <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsCreateGroupOpen(true); resetForm(); }}>
              <PlusIcon className="h-4 w-4 mr-2" /> Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white text-black">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div>
                <Label className="text-sm font-medium">Select Members:</Label>
                <ScrollArea className="h-[200px] w-full border rounded-md p-4 mt-2">
                {users.map(user => (
        <div key={user.id} className="flex items-center space-x-2 py-2">
          <Checkbox
            id={`create-user-${user.id}`}
            checked={(selectedMemberIds || []).includes(user.id)} 
            onCheckedChange={() => handleMemberSelect(user.id)} 
          />
          <Label htmlFor={`create-user-${user.id}`} className="flex items-center cursor-pointer">
            <Avatar>
              <AvatarImage 
                src={`${process.env.NEXT_PUBLIC_CONTACT_API}/api/?name=${user.username}&background=random`} 
                alt={user.username || 'User Avatar'} 
              />
              <AvatarFallback>
                {user.username ? user.username[0].toUpperCase() : 'U'} 
              </AvatarFallback>
            </Avatar>
            <span className="ml-2">{user.username || 'Unknown User'}</span> 
          </Label>
        </div>
      ))}
                </ScrollArea>
              </div>
              <Button type="submit" className="mt-4">Create Group</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {groups.map(group => (
    <Card key={group.id} className="bg-white text-black rounded-lg shadow-md overflow-hidden">
      <CardHeader className="bg-white p-4">
        <CardTitle className="text-xl font-bold">{group.groupName}</CardTitle>
        <CardDescription className="text-sm">{group.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => handleShowGroupMembers(group)}>
            <UsersIcon className="h-4 w-4 mr-2" /> View Members
          </Button>
          <div className="flex space-x-2">
            <Button onClick={() => handleEditGroup(group)} variant="outline">
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => handleDeleteGroup(group.id)}
             className="text-black border bg-white border-white hover:bg-red-500"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>



      <Dialog open={isEditGroupOpen} onOpenChange={setIsEditGroupOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-black">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateGroup} className="space-y-4">
            <Input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div>
              <Label className="text-sm font-medium">Select Members:</Label>
              <ScrollArea className="h-[200px] w-full border rounded-md p-4 mt-2">
                {users.map(user => (
                  <div key={user.id} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={`edit-user-${user.id}`}
                      checked={(selectedMemberIds || []).includes(user.id)}
                      onCheckedChange={() => handleMemberSelect(user.id)}
                    />
                    <Label htmlFor={`edit-user-${user.id}`} className="flex items-center cursor-pointer">
                      <Avatar>
                        <AvatarImage 
                          src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                          alt={user.username || 'User Avatar'} 
                        />
                        <AvatarFallback>
                          {user.username ? user.username[0].toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-2">{user.username || 'Unknown User'}</span>
                    </Label>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <Button type="submit" className="mt-4">Update Group</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white text-black">
          <DialogHeader>
            <DialogTitle>{selectedGroup?.groupName}</DialogTitle>
          </DialogHeader>
          <div>
            <h2 className="text-lg font-bold">Members:</h2>
            {selectedGroup?.members && selectedGroup.members.length > 0 ? (
              <ul>
                {selectedGroup.members.map(member => (
                  <li key={member.id} className="flex items-center py-2">
                    <Avatar>
                      <AvatarImage 
                        src={`https://ui-avatars.com/api/?name=${member.username}&background=random`} 
                        alt={member.username || 'User Avatar'} 
                      />
                      <AvatarFallback>
                        {member.username ? member.username[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="ml-2">{member.username || 'Unknown User'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No members found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      

      <ToastContainer />
    </div>
  )
}