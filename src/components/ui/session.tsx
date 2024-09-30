"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 

interface CustomSession {
  user?: {
    userId : number;
    username: string;
    email: string;
    profilePic : string;
  };
}

export const useSession = (): CustomSession | null => {
  const [session, setSession] = useState<CustomSession | null>(null);
  const searchParams = useSearchParams(); 

  useEffect(() => {
    const userParam = searchParams.get('user'); 
    
    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        setSession({ user });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [searchParams]);
  
  return session;
};
