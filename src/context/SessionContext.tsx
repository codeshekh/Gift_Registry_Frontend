"use client";
import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Define the shape of your session data
interface User {
  id: number;
  username: string;
  email: string;
  profilePic: string;
}

interface CustomSession {
  logout: () => void; // Logout function must always be present
  user?: User; // Optional user data
}

// Create a context with default value
const SessionContext = createContext<CustomSession | null>(null);

interface SessionProviderProps {
  children: ReactNode;
}

// Create a Provider component
export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [session, setSession] = useState<CustomSession>({
    logout: () => {}, // Empty default logout function
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    // Function to handle user login
    const handleUserLogin = (user: User) => {
      const logout = () => {
        console.log('User logged out');
        setSession({ logout }); // Clear user session data
        localStorage.removeItem('userData'); // Remove user data from localStorage
      };

      setSession({ user, logout }); // Update session with user data and logout function
      localStorage.setItem('userData', JSON.stringify(user)); // Store user data in localStorage
    };

    // Check for user parameter in URL
    const userParam = searchParams.get('user');
    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        handleUserLogin(user); // Handle the user login from URL parameter
      } catch (error) {
        console.error('Error parsing user data:', error);
        setSession({ logout: () => {} }); // Reset session state in case of error
      }
    } else {
      // Load user data from localStorage if no user in URL
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        handleUserLogin(JSON.parse(storedUser)); // Load user from localStorage
      }
    }
  }, [searchParams]); // Dependency array ensures this effect runs on searchParams change

  return (
    <Suspense fallback={<div>Loading session...</div>}>
      <SessionContext.Provider value={session}>
        {children}
      </SessionContext.Provider>
    </Suspense>
  );
};

// Hook to use session in any component
export const useSession = () => {
  return useContext(SessionContext);
};
