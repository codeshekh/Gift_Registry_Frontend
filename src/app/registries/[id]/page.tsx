'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Input from "@/components/ui/input";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusIcon, ArrowLeft, ShoppingCart, Check, Link, ExternalLink } from 'lucide-react';

interface Gift {
  id: number;
  name: string;
  giftUrl: string;
  price: number;
  Image: string;
  giftStatus: boolean;
}

export default function RegistryGiftsPage({ params }: { params: { id: string } }) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isAddGiftOpen, setIsAddGiftOpen] = useState(false);
  const [newGift, setNewGift] = useState({ giftName: '', giftUrl: '', price: '', Image: '' });
  const [scrapedUrl, setScrapedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const response = await fetch(`http://localhost:4000/v1/gifts/gift-list/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch gifts');
      const data = await response.json();
      setGifts(data);
    } catch (error) {
      toast.error('Failed to fetch gifts');
    }
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const giftData = {
      giftName: newGift.giftName,
      giftUrl: newGift.giftUrl,
      price: parseFloat(newGift.price.replace(/,/g, '')), // Convert price to number
      Image: newGift.Image,
      registryId: parseInt(params.id),
    };

    try {
      const response = await fetch('http://localhost:4000/v1/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(giftData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add gift');
      }

      const addedGift = await response.json();
      setGifts(prevGifts => [...prevGifts, { ...addedGift, giftStatus: false }]);
      setIsAddGiftOpen(false);
      setNewGift({ giftName: '', giftUrl: '', price: '', Image: '' });
      toast.success('Gift added successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add gift. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyGift = async (giftId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/v1/gifts/${giftId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftStatus: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to update gift status');
      }

      setGifts(gifts.map(gift =>
        gift.id === giftId ? { ...gift, giftStatus: true } : gift
      ));
      toast.success('Gift marked as purchased');
    } catch (error) {
      toast.error('Failed to update gift status');
    }
  };

  const handleScrapeGift = async () => {
    if (!scrapedUrl) {
      toast.error('Please enter a URL to scrape');
      return;
    }

    setIsScraping(true);
    try {
      const response = await fetch(`/api/scraper?url=${encodeURIComponent(scrapedUrl)}`);
      if (!response.ok) {
        throw new Error('Failed to scrape gift information');
      }
      const data = await response.json();
      console.log(data);

      // Convert price string to a number
      const formattedPrice = parseFloat(data.productPrice.replace(/₹|,/g, '')).toLocaleString('en-IN');

      setNewGift({
        giftName: data.productName,
        giftUrl: scrapedUrl,
        price: formattedPrice.toString(), // Store as string for consistency
        Image: data.productImage,
      });
      toast.success('Gift information scraped successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to scrape gift information');
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-5">
      <Button onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Registries
      </Button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gifts in this Registry</h1>
        <Dialog open={isAddGiftOpen} onOpenChange={setIsAddGiftOpen}>
          <DialogTrigger asChild>
            <Button><PlusIcon className="mr-2 h-4 w-4" /> Add Gift</Button>
          </DialogTrigger>
          <DialogContent className="bg-black text-white">
            <DialogHeader><DialogTitle>Add New Gift</DialogTitle></DialogHeader>
            <form onSubmit={handleAddGift} className="space-y-4">
              <Input
                className="bg-gray-800 text-white border-gray-600"
                placeholder="Gift Name"
                value={newGift.giftName}
                onChange={(e) => setNewGift({ ...newGift, giftName: e.target.value })}
                required
              />
              <Input
                className="bg-gray-800 text-white border-gray-600"
                placeholder="Gift Price"
                type="number"
                step="0.01"
                value={newGift.price}
                onChange={(e) => setNewGift({ ...newGift, price: e.target.value })}
                required
              />
              <Input
                className="bg-gray-800 text-white border-gray-600"
                placeholder="Gift Image URL"
                value={newGift.Image}
                onChange={(e) => setNewGift({ ...newGift, Image: e.target.value })}
                required
              />
              <Input
                className="bg-gray-800 text-white border-gray-600"
                placeholder="Gift URL (optional)"
                value={newGift.giftUrl}
                onChange={(e) => setNewGift({ ...newGift, giftUrl: e.target.value })}
              />
              <Button type="submit" className="bg-white text-black hover:bg-gray-200" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Add Gift'}
              </Button>
              <h2 className="mt-4 text-lg font-bold">Or Add Gift via Scraping</h2>
              <div className="flex space-x-2">
                <Input
                  className="bg-gray-800 text-white border-gray-600 flex-grow"
                  placeholder="Enter Amazon or Flipkart URL"
                  value={scrapedUrl}
                  onChange={(e) => setScrapedUrl(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleScrapeGift}
                  className="bg-white text-black hover:bg-gray-200"
                  disabled={isScraping}
                >
                  <Link className="mr-2 h-4 w-4" />
                  {isScraping ? 'Scraping...' : 'Scrape'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.map(gift => (
          <Card key={gift.id} className="hover:shadow-lg transition-shadow bg-white overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={gift.Image || '/placeholder.svg?height=200&width=400'}
                alt={gift.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{gift.name}</CardTitle>
                {gift.giftStatus ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Button onClick={() => handleBuyGift(gift.id)}><ShoppingCart className="h-5 w-5 mr-2" /> Buy</Button>
                )}
              </div>
            </CardHeader>
            <CardContent><p className="text-gray-700">₹ {gift.price}</p></CardContent>
          </Card>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}
