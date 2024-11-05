'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import  Input  from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'react-toastify'
import { Copy } from 'lucide-react'

interface AddressFormProps {
  userId: number
  onSave: () => void
}

interface Address {
  addressLine1: string
  addressLine2: string
  landmark: string
  pincode: number
  city: string
  country: string
}

export default function Component({ userId, onSave = () => {} }: AddressFormProps) {
    
  const [address, setAddress] = useState<Address>({
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    pincode: 0,
    city: '',
    country: '',
  })

  const [savedAddress, setSavedAddress] = useState<Address | null>(null)

  useEffect(() => {
    fetchAddress()
  }, [userId])

  const fetchAddress = async () => {
    try {
      const response = await fetch(`http://localhost:4000/v1/users/address/${userId}`); // Corrected the URL
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      console.log(data);
      // Access the 'data' array from the response
      if (data && data.data) {
        setAddress(data.data[0]); // Assuming you want the first address
        setSavedAddress(data.data[0]); // Set saved address to the first one
      } else {
        throw new Error('No address data found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Failed to fetch address');
    }
  }

  const handleSaveAddress = async () => {
    if (!Number.isInteger(address.pincode) || address.pincode <= 0) {
      toast.error('Please enter a valid pincode')
      return
    }

    try {
      const response = await fetch(`http://localhost:4000/v1/users/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          ...address 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create address')
      }

      const responseData = await response.json()
      console.log('Address Created:', responseData.data)

      setSavedAddress(address)
      onSave()
      toast.success('Address created successfully')
    } catch (error) {
      console.error('Error creating address:', error)
      toast.error('Failed to create address')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const renderInput = (label: string, key: keyof Address, type: string = 'text') => (
    <div className="grid gap-2">
      <Label htmlFor={key}>{label}</Label>
      <div className="flex">
        <Input
          id={key}
          placeholder={label}
          type={type}
          value={address[key] === 0 && type === 'number' ? '' : address[key]}
          onChange={(e) => setAddress({ ...address, [key]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })}
          className="flex-grow"
        />
        <Button
          variant="outline"
          size="icon"
          className="ml-2"
          onClick={() => copyToClipboard(address[key].toString())}
          aria-label={`Copy ${label}`}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderSavedField = (label: string, value: string | number) => (
    <div className="flex items-center justify-between py-2">
      <span className="font-medium">{label}:</span>
      <div className="flex items-center">
        <span>{value}</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => copyToClipboard(value.toString())}
          aria-label={`Copy ${label}`}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {renderInput('Address Line 1', 'addressLine1')}
        {renderInput('Address Line 2', 'addressLine2')}
        {renderInput('Landmark', 'landmark')}
        {renderInput('Pincode', 'pincode', 'number')}
        {renderInput('City', 'city')}
        {renderInput('Country', 'country')}
      </div>
      <Button onClick={handleSaveAddress} className="w-full">
        Save Address
      </Button>
      {/* {savedAddress && (
        <div className="mt-6 p-4 border rounded-md">
          <h2 className="text-lg font-semibold mb-2">Saved Address</h2>
          {renderSavedField('Address Line 1', savedAddress.addressLine1)}
          {renderSavedField('Address Line 2', savedAddress.addressLine2)}
          {renderSavedField('Landmark', savedAddress.landmark)}
          {renderSavedField('Pincode', savedAddress.pincode)}
          {renderSavedField('City', savedAddress.city)}
          {renderSavedField('Country', savedAddress.country)}
        </div>
      )} */}
    </div>
  )
}
