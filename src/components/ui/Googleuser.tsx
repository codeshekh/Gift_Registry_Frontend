"use client"

import React, { useState } from 'react'
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa'
import Input from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      toast.success('Login successful')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
      console.error('Login error:', error)
    }
  }

  return (
    <div className="flex items-center justify-center h-3/4 p-4"> {/* Adjusted height here */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto shadow-2xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gray-900 text-white text-center py-6">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email" className="py-2 text-lg font-semibold">
                  Email
                </TabsTrigger>
                <TabsTrigger value="google" className="py-2 text-lg font-semibold">
                  Google
                </TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                    Login with Email
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="google">
                <div className="relative overflow-hidden rounded-lg">
                  <Button
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 hover:bg-red-700"
                  >
                    <FaGoogle size={20} className="mr-2" />
                    Sign in with Google
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-gray-100 p-4 text-center">
            <p className="text-sm text-gray-600">
          
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginComponent
