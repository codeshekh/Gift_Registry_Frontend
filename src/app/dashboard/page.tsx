"use client"
import { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { PlusSquare, Share2 } from 'lucide-react';
import CreateEventForm from '@/components/ui/createeventbutton'; // Ensure this is the correct path
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import ParticleBackground from '@/components/ui/partical';


interface Group {
  id: number;
  groupName: string;
}

const mockGroups: Group[] = [
  { id: 1, groupName: "Family" },
  { id: 2, groupName: "Friends" },
  { id: 3, groupName: "Colleagues" },
];

export default function HomeDashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showParticles, setShowParticles] = useState(false); // State to control the form visibility
  const session = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const handleCreateRegistry = () => {
    setIsFormOpen(true); 
  };

  const handleCreateEvent = async (eventData: any) => {
  
    console.log("Event data submitted:", eventData);
  
  };


  const handleShareClick = () => {
    setShowParticles(true);
    setTimeout(() => {
      setShowParticles(false); // Hide particles after a delay
    }, 3000); // Adjust the delay as needed
  };



  return (
    <div className="min-h-screen bg-white">
      <ParticleBackground isVisible={showParticles} />
      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className='mt-14 ml-8'>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-orange-500">Create</span> a Gift Registry<br />
              and <span className="text-orange-500">Share</span> it with<br />
              your guests
            </h1>
            <div className="space-x-4 mt-16">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white mr-3" 
                onClick={() => router.push('/events')}
              >
                Create New Registry
              </Button>
              <Button variant="outline" className="text-gray-700 border-gray-300"
              onClick={() => router.push('/allevents')}>
                Your Existing Registriess
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-0 left-28 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden">
              <Image src="/back_gift.jpg" alt="Celebration" layout="fill" objectFit="cover" />
              <div className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-md">
                <PlusSquare className="w-6 h-6 text-orange-500" />
              </div>
              <span className="absolute bottom-0 left-0 bg-white px-2 py-1 text-sm text-orange-500 font-semibold">Create</span>
            </div>
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-16 left-3/4 bg-white text-orange-500 rounded-full p-2"
              >
                <PlusSquare className="w-6 h-6" />
                <span className="ml-1">Create</span>
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-96 left-60 bg-white text-orange-500 rounded-full p-2"
              >
                <Share2 className="w-6 h-6" />
                <span className="ml-1">Share</span>
              </Button>
            </div>

            <div className="absolute top-20 right-16 w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden">
              <div className="absolute bg-white rounded-full opacity-20 w-96 h-96" />
              <Image src="/gift.png" alt="Gift box" layout="fill" objectFit="cover" className="rounded-full" />
            </div>
          </div>
        </div>
      </main>

      {/* Conditional Rendering of CreateEventForm */}
      {isFormOpen && userId !== undefined && (
        <CreateEventForm
          userId={userId} // Pass userId as a prop
          groups={mockGroups} // Pass the mock groups
          onCreateEvent={handleCreateEvent} // Pass the event creation function
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-orange-100 rounded-full opacity-50"></div>
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-orange-200 rounded-full opacity-60"></div>
      <div className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-orange-300 rounded-full opacity-40"></div>
      <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-orange-50 rounded-full opacity-30"></div>
      <div className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-orange-100 rounded-full opacity-20"></div>
    </div>
  );
}
