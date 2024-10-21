// AddressForm.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button"; // Adjust the import paths as per your project structure
import Input from "@/components/ui/input"; // Adjust the import paths as per your project structure
import { Label } from "@/components/ui/label"; // Adjust the import paths as per your project structure
import { toast } from 'react-toastify';

interface AddressFormProps {
    userId: number;  // Expect a number, not a string
    onSave: () => void; // Callback function to refresh or re-fetch the updated address
}

export default function AddressForm({ userId, onSave }: AddressFormProps) {
    const [address, setAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        pincode: 0,
        city: '',
        country: '',
    });

    const handleSaveAddress = async () => {
        // Validate pincode
        if (!Number.isInteger(address.pincode) || address.pincode <= 0) {
            toast.error('Please enter a valid pincode');
            return;
        }

        try {
            // Send a POST request to create a new address
            const response = await fetch(`http://localhost:4000/v1/users/address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId, // Include userId in the request body
                    ...address 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create address');
            }

            const responseData = await response.json(); // Get the response data
            console.log('Address Created:', responseData.data); // Log the created address data for debugging

            onSave(); // Callback to refresh or re-fetch the updated address
            toast.success('Address created successfully'); // Notify the user
        } catch (error) {
            console.error('Error creating address:', error);
            toast.error('Failed to create address'); // Notify the user
        }
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="addressLine1" className="text-right text-white">Address Line 1</Label>
                <Input
                    id="addressLine1"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="col-span-3 bg-gray-800 text-white border-gray-600"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="addressLine2" className="text-right text-white">Address Line 2</Label>
                <Input
                    id="addressLine2"
                    value={address.addressLine2}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    className="col-span-3 bg-gray-800 text-white border-gray-600"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="landmark" className="text-right text-white">Landmark</Label>
                <Input
                    id="landmark"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    className="col-span-3 bg-gray-800 text-white border-gray-600"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pincode" className="text-right text-white">Pincode</Label>
                <Input
                    id="pincode"
                    value={address.pincode === 0 ? '' : address.pincode}  // Default to empty if 0
                    onChange={(e) => setAddress({ ...address, pincode: parseInt(e.target.value) || 0 })}
                    className="col-span-3 bg-gray-800 text-white border-gray-600"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right text-white">City</Label>
                <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="col-span-3 bg-gray-800 text-white border-gray-600"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right text-white">Country</Label>
                <Input
                    id="country"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="col-span-3 bg-gray-800 text-white border-gray-600"
                />
            </div>
            <Button onClick={handleSaveAddress} className="text-white bg-gray-800 border-white">
                Save Address
            </Button>
        </div>
    );
}
