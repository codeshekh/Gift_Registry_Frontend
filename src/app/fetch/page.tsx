'use client';

import { useEffect, useState,FC } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Member {
  id: number;
  username: string;
  email: string;
}

interface Group {
  id: number;
  groupName: string;
  description: string;
  members: Member[];
}

const Page:FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all groups from the backend on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:4000/v1/groups/6`);
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        setGroups(data.data); // Assuming your API response has a 'data' property
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast.error('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Group Details</h1>

      {loading ? (
        <div>Loading...</div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="flex flex-col">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>{group.groupName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-semibold">{group.groupName}</h4>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <span>{group.members.length} members</span>
                </div>
                <div className="mt-2">
                  <h5 className="font-semibold">Members:</h5>
                  <ul className="list-disc pl-5">
                    {group.members.map(member => (
                      <li key={member.id}>{member.username} ({member.email})</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>No groups found</div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Page;
