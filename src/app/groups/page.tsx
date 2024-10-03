'use client';

import { SetStateAction, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input  from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusIcon, TrashIcon, PencilIcon, UserPlusIcon, XIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import  Textarea  from "@/components/ui/textarea";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useSession } from '@/context/SessionContext';

interface Group {
  id: number;
  userId: number;
  groupName: string;
  description: string;
  memberIds: number[];
}
interface User{
  id: number;
  email: string;
  username: string;
}

interface NewGroup{
  groupOwnerId: number;
  groupName: string;
  description :string;
  memberIds: number[];
}
export default function GroupPage() {
  const session = useSession();
  const userId = session?.user?.id;

  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);


  useEffect(() => {
    fetchGroups();
    fetchAllUsers();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch(`http://localhost:4000/v1/groups/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data.data);
    } catch (error) {
      console.error('Error Fetching groups:', error);
      toast.error('Failed to Fetch Groups');
    }
  };

const fetchAllUsers = async () =>{
  try{
    const response = await fetch(`http://localhost:4000/users/all`);
    if(!response.ok){
      throw new Error('Failed to Fetch Users');
    }
    const data = await response.json();
    console.log('Fetched Users:', data);
    setUsers(data);
  }catch(error){
    console.log('Error Fetching groups: error');
    toast.error('Failed to Fetch Users');
  }
}

const handleMemberSelect = (userId: number) => {
  setSelectedMemberIds((prev) => {
    
    if (prev && prev.includes(userId)) {
      return prev.filter((id) => id !== userId); 
    } else {
      return [...(prev || []), userId]; 
    }
  });
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:4000/v1/groups/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupName,
        description,
        memberIds: selectedMemberIds, // Use selected user IDs
        groupOwnerId: userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create group');
    }

    const responseData = await response.json();
    const newGroup: Group = {
      userId: responseData.data.userId,
      id: responseData.data.id,
      groupName: responseData.data.groupName,
      description: responseData.data.description,
      memberIds: selectedMemberIds, // Keep selected user IDs
    };

    setGroups((prevGroups) => [...prevGroups, newGroup]);
    toast.success('Group created successfully');
   resetForm();
  } catch (error) {
    toast.error('Failed to create group');
    console.error(error);
  }
};
const resetForm = () => {
  setGroupName('');
  setDescription('');
  setSelectedMemberIds([]);
  setIsCreateGroupOpen(false);
  setIsEditGroupOpen(false);
};


const handleEditGroup = (group: Group) => {
  setEditingGroup(group);
  setGroupName(group.groupName);
  setDescription(group.description);
  setSelectedMemberIds(group.memberIds);
  setIsEditGroupOpen(true);
};


const handleDeleteGroup = async (groupId: number) => {
  try {
    const response = await fetch(`http://localhost:4000/v1/groups/${groupId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete group');
    }

    setGroups(groups.filter((group) => group.id !== groupId));
    toast.info('Group deleted');
  } catch (error) {
    toast.error('Failed to delete group');
    console.error(error);
  }
};



const handleUpdateGroup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!editingGroup) return;

  try {
    const response = await fetch(`http://localhost:4000/v1/groups/${editingGroup.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        groupName,
        description,
        memberIds: selectedMemberIds,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update group');
    }

    const updatedGroup: Group = {
      ...editingGroup,
      groupName,
      description,
      memberIds: selectedMemberIds,
    };

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === editingGroup.id ? updatedGroup : group
      )
    );
    toast.success('Group updated successfully');
    resetForm();
  } catch (error) {
    toast.error('Failed to update group');
    console.error(error);
  }
};


return (
  <div className="container mx-auto p-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Group Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Popover open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
            <PopoverTrigger asChild>
              <Button onClick={() => { setIsCreateGroupOpen(true); resetForm(); }}>
                <PlusIcon className="h-4 w-4 mr-2" /> Create Group
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
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
                          checked={(selectedMemberIds ?? []).includes(user.id)}
                          onCheckedChange={() => handleMemberSelect(user.id)}
                        />
                        <Label htmlFor={`create-user-${user.id}`}>{user.username}</Label>
                      </div>
                    ))}
                  </ScrollArea>
                </div>

                <div>
                  <Label className="text-sm font-medium">Selected Members:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(selectedMemberIds ?? []).map(id => {
                      const user = users.find(u => u.id === id);
                      return user ? (
                        <Badge key={id} variant="secondary" className="text-xs">
                          {user.username}
                          <XIcon 
                            className="h-3 w-3 ml-1 cursor-pointer" 
                            onClick={() => handleMemberSelect(id)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="submit">Create Group</Button>
                  <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>Cancel</Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.groupName}</TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>
  {users
    .filter((user) => (group.memberIds ?? []).includes(user.id))
    .map((user) => user.username)
    .join(', ')}
</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditGroup(group)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteGroup(group.id)}>
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No groups found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <ToastContainer />

    <Dialog open={isEditGroupOpen} onOpenChange={setIsEditGroupOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                    checked={(selectedMemberIds ?? []).includes(user.id)}
                    onCheckedChange={() => handleMemberSelect(user.id)}
                  />
                  <Label htmlFor={`edit-user-${user.id}`}>{user.username}</Label>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div>
            <Label className="text-sm font-medium">Selected Members:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(selectedMemberIds ?? []).map(id => {
                const user = users.find(u => u.id === id);
                return user ? (
                  <Badge key={id} variant="secondary" className="text-xs">
                    {user.username}
                    <XIcon 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleMemberSelect(id)}
                    />
                  </Badge>
                ) : null;
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit">Update Group</Button>
            <Button variant="outline" onClick={() => setIsEditGroupOpen(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
);

}