"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import  Input  from "@/components/ui/input";
import  Textarea  from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";

const eventTypes = ['BIRTHDAY', 'WEDDING', 'ANNIVERSARY', 'BABY_SHOWER', 'OTHER'];

interface Group {
  id: number;
  groupName: string;
}

interface CreateEventFormProps {
  userId: number;
  groups: Group[];
  onCreateEvent: (eventData: any) => void;
  onClose: () => void;
}

export default function CreateEventForm({ userId, groups, onCreateEvent, onClose }: CreateEventFormProps) {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<string | "">("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [groupId, setGroupId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      userId,
      eventName,
      description,
      eventType,
      venue,
      date,
      groupId,
    };
    try {
      await onCreateEvent(eventData);
      onClose();
    } catch (error) {
      toast.error("Failed to create event");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Event Type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
            <Input
              type="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Select value={groupId !== null ? groupId.toString() : ""} onValueChange={(value) => setGroupId(value ? parseInt(value) : null)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.groupName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end space-x-2">
              <Button type="submit">Create Event</Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}