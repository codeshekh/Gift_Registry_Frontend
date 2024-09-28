'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Card, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Ensure this import is correct
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusIcon, UsersIcon, TrashIcon } from 'lucide-react'; // Import TrashIcon

const CreateGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [userId] = useState(1);
  const [additionalUserIds, setAdditionalUserIds] = useState('');
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([
    { id: 1, groupName: 'Default Group 1', description: 'This is a default group', members: [1, 2, 3] },
    { id: 2, groupName: 'Default Group 2', description: 'This is another default group', members: [1, 4, 5] },
  ]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [userToAdd, setUserToAdd] = useState(''); // State to hold user ID to add

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setGroupImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userIdArray = additionalUserIds.split(',').map(Number);

    const formData = new FormData();
    if (groupImage) formData.append('groupImage', groupImage as Blob);
    formData.append('createGroupDto', JSON.stringify({
      userId,
      groupName,
      description,
    }));
    formData.append('userId', JSON.stringify([userId, ...userIdArray]));

    try {
      const response = await axios.post('http://localhost:4000/groups', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.data) {
        setMessage('Group created successfully');
        setGroups([...groups, { id: response.data.data, groupName, description, members: [userId, ...userIdArray] }]);
        setIsPopoverOpen(false);
        setGroupName('');
        setDescription('');
        setAdditionalUserIds('');
        setGroupImage(null);
      } else {
        setMessage('Failed to create group. Please try again.');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setMessage('Error creating group');
    }
  };

  const handleDeleteGroup = (groupId: number) => {
    console.log(`Delete group with ID: ${groupId}`);
    setGroups(groups.filter(group => group.id !== groupId));
  };

  const handleAddUserToGroup = (groupId: number) => {
    if (!userToAdd) return;

    setGroups(groups.map(group => {
      if (group.id === groupId) {
        // Add user to the members array
        const updatedMembers = [...group.members, Number(userToAdd)];
        return { ...group, members: updatedMembers };
      }
      return group;
    }));
    
    setUserToAdd(''); // Reset input after adding
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>

      <div className="flex justify-center mb-9 relative z-50">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <button 
              onClick={() => setIsPopoverOpen(true)}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md flex items-center">
              <PlusIcon className="h-4 w-4" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="center"
            sideOffset={10}
            className="p-6 bg-white shadow-lg rounded-lg max-w-md w-full z-50"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  required
                />
              </div>
              <div>
                <Label htmlFor="additionalUserIds">Additional User IDs (comma-separated)</Label>
                <Input
                  id="additionalUserIds"
                  value={additionalUserIds}
                  onChange={(e) => setAdditionalUserIds(e.target.value)}
                  placeholder="Enter additional user IDs"
                  required
                />
              </div>
              <div>
                <Label htmlFor="groupImage">Group Picture</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 border border-gray-300 rounded-md"
                />
              </div>
              <Button type="submit" className="w-full">
                <PlusIcon className="h-4 w-4 mr-2" />
              </Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
        {groups.length > 0 ? (
          groups.map((group) => (
            <Card key={group.id} className="flex flex-col">
              <CardContent className="p-4 flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${group.groupName.charAt(0)}`} alt={group.groupName} />
                  <AvatarFallback>{group.groupName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold">{group.groupName}</h4>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  {group.members.length} members
                </div>
              </CardContent>
              <div className="flex justify-between space-x-2 p-2">
                <div className="flex items-center space-x-2">
                  <Input
                    value={userToAdd}
                    onChange={(e) => setUserToAdd(e.target.value)}
                    placeholder="User ID"
                    className="w-24"
                  />
                  <Button onClick={() => handleAddUserToGroup(group.id)}>
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="destructive" onClick={() => handleDeleteGroup(group.id)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No groups available.</p>
        )}
      </div>

      {message && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default CreateGroupPage;
