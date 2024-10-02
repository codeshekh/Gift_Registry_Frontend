import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { UserPlus, Trash2 } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

interface GroupCardProps {
  groupName: string;
  description: string;
  members: { id: number, username: string }[];
  onAddPeople: () => void;
  onDeleteGroup: () => void;
  group?: boolean; // Add this line if you need the group prop
}

export default function GroupCard({ 
  groupName = "My Group", 
  description = "No description available",
  members = [],
  onAddPeople = () => {}, 
  onDeleteGroup = () => {},
  
}: GroupCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Card 
          className="w-full max-w-sm transition-all duration-300 ease-in-out transform hover:shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardHeader className="relative pb-0">
            <CardTitle className="text-2xl font-bold">
              {groupName}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-500">{description}</p> {/* Show the description */}
            <p className="mt-2 font-semibold">Members:</p>
            <ul className="list-disc ml-5">
              {members.map(member => (
                <li key={member.id} className="text-sm text-gray-700">
                  {member.username}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={onAddPeople}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add People
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onDeleteGroup}
              className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Group
            </Button>
          </CardFooter>
        </Card>
      </Popover.Trigger>

      {/* Popover Content */}
      <Popover.Portal>
        <Popover.Content
          align="center"
          side="top"
          sideOffset={10}
          className="p-4 bg-white rounded-md shadow-md border"
        >
          <h3 className="text-lg font-semibold">{groupName}</h3>
          <p className="text-sm text-gray-500">{description}</p>
          <ul className="list-disc ml-5 mt-2">
            {members.map(member => (
              <li key={member.id} className="text-sm text-gray-700">
                {member.username}
              </li>
            ))}
          </ul>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
