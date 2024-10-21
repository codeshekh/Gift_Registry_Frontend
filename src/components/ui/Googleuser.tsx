'use client'

import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'


export default function Component() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userData, setUserData] = useState(null) 
  const [showLoginForm, setShowLoginForm] = useState(false) // State to toggle the form
  const router = useRouter()

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }

 // In your login component (Component.tsx)
const handleEmailLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    console.log(data);
    toast.success('Login successful');
    
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(data));
    
    router.push('/dashboard');
  } catch (error) {
    toast.error('Login failed. Please check your credentials.');
    console.error('Login error:', error);
  }
};



// if(userData){


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    
        <Card className="w-full max-w-md mx-auto shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-3xl font-bold">Log in or Sign up to continue</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button
                onClick={handleGoogleLogin}
                className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-3 px-4 rounded-lg flex items-center justify-center transition duration-300"
              >
                <FaGoogle size={20} className="mr-2 text-red-700" />
                Continue with Google
              </Button>

              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-gray-500">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Toggle login form on button click */}
              <Button
                onClick={() => setShowLoginForm(!showLoginForm)} // Toggle form visibility
                className="w-full bg-orange-500 text-white hover:bg-orange-600 py-3 px-4 rounded-lg flex items-center justify-center transition duration-300"
              >
                {showLoginForm ? 'Cancel' : 'Log in with password'}
              </Button>

              {/* Conditional rendering of login form */}
              {showLoginForm && (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600 py-3 px-4 rounded-lg transition duration-300"
                  >
                    Log in
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
            </p>
          </CardFooter>
        </Card>
      
    </div>
  )
}

// }