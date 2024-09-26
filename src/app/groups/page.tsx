'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import GroupCard from '@/components/ui/GroupCard'; // Make sure to adjust the import path

const CreateGroupPage = () => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState(1); // Assuming the main userId is always 1 (modify if dynamic)
  const [additionalUserIds, setAdditionalUserIds] = useState('');
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([
    { id: 1, groupName: 'Default Group 1', description: 'This is a default group', members: [1, 2, 3] },
    { id: 2, groupName: 'Default Group 2', description: 'This is another default group', members: [1, 4, 5] },
  ]); // Initial default group data
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse the additional userIds from the input
    const userIdArray = additionalUserIds.split(',').map(Number); 

    const payload = {
      createGroupDto: {
        userId, // The main userId
        groupName,
        description,
      },
      userId: [userId, ...userIdArray], // Merge the main userId with additional ones
    };

    try {
      const response = await axios.post('http://localhost:4000/groups', payload);

      if (response.data.data) {
        setMessage('Group created successfully');
        setGroups([...groups, { id: response.data.data, groupName, description, members: [userId, ...userIdArray] }]);
        setIsPopoverOpen(false); // Close the popover after creating the group
      } else {
        setMessage('Failed to create group. Please try again.');
      }
    } catch (error) {
      console.error('Error creating group:', error);
      setMessage('Error creating group');
    }
  };

  const handleAddPeople = (groupId: number) => {
    // Logic to add people to the group
    console.log(`Add people to group with ID: ${groupId}`);
  };

  const handleDeleteGroup = (groupId: number) => {
    // Logic to delete the group
    console.log(`Delete group with ID: ${groupId}`);
    setGroups(groups.filter(group => group.id !== groupId)); // Remove the group from the state
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Groups</h1>

      {/* Centered Create Group Button with Popover */}
      <div className="flex justify-center mb-9 relative z-50">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <button 
              onClick={() => setIsPopoverOpen(true)}
              className="py-2 px-4 bg-indigo-600 text-white rounded-md">
              Create Group
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
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                  Group Name
                </label>
                <input
                  type="text"
                  name="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500"
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500"
                  placeholder="Enter description"
                  required
                />
              </div>
              <div>
                <label htmlFor="additionalUserIds" className="block text-sm font-medium text-gray-700">
                  Additional User IDs (comma-separated)
                </label>
                <input
                  type="text"
                  name="additionalUserIds"
                  value={additionalUserIds}
                  onChange={(e) => setAdditionalUserIds(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500"
                  placeholder="Enter additional user IDs"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create Group
              </button>
            </form>
          </PopoverContent>
        </Popover>
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
        {groups.length > 0 ? (
          groups.map((group) => (
            <GroupCard
              key={group.id}
              groupName={group.groupName}
              memberCount={group.members.length}
              onAddPeople={() => handleAddPeople(group.id)}
              onDeleteGroup={() => handleDeleteGroup(group.id)}
            />
          ))
        ) : (
          <p>No groups available.</p>
        )}
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default CreateGroupPage;