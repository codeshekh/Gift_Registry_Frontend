"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Ensure you are using the correct import

interface CustomSession {
  user?: {
    image?: string;
    username?: string;
    email?: string;
  };
}

export const useSession = (): CustomSession | null => {
  const [session, setSession] = useState<CustomSession | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // Use useSearchParams hook

  useEffect(() => {
    const userParam = searchParams.get('user'); // Get the 'user' parameter

    if (userParam) { // Check if the 'user' parameter exists
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        setSession({ user }); // Set session with user data from query
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [searchParams]);

  return session;
};
