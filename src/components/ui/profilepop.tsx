import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User } from "lucide-react";

interface ProfileProps {
  name: string;
  email: string;
  profilePic?: string;
}

export default function ProfilePopover({ name, email, profilePic}: ProfileProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={profilePic} alt={name} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profilePic} alt={name} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-lg font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
