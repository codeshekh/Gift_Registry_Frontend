'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Gift, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useSession } from '@/context/SessionContext'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { motion, AnimatePresence } from 'framer-motion'
import { categories } from '@/data/categories'

interface Product {
  id: number
  name: string
  price: number
  imageUrl: string
  amazonUrl: string
  flipkartUrl: string
  description?: string
  subproducts?: Product[]
}

interface Registry {
  id: number
  name: string
  userId?: number
  eventId: number
}

export default function EnhancedProductCarousel() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [registries, setRegistries] = useState<Registry[]>([])
  const [selectedRegistry, setSelectedRegistry] = useState<Registry | null>(null)
  const [giftUrl, setGiftUrl] = useState<string>('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [showProductDetails, setShowProductDetails] = useState(false)

  const session = useSession()
  const userId = session?.user?.id

  useEffect(() => {
    fetchRegistries()
  }, [])

  const fetchRegistries = async () => {
    try {
      const response = await fetch(`http://localhost:4000/v1/registries/user-registries/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch registries')
      const data = await response.json()
      setRegistries(data)
    } catch (error) {
      console.error('Error fetching registries:', error)
      toast({
        title: "Error",
        description: "Failed to fetch registries",
        variant: "destructive",
      })
    }
  }

  const handleAddGift = async (product: Product) => {
    if (!selectedRegistry) {
      toast({
        title: "Error",
        description: "Please select a registry first",
        variant: "destructive",
      })
      return
    }
    if (!giftUrl) {
      toast({
        title: "Error",
        description: "Please select a gift URL",
        variant: "destructive",
      })
      return
    }
    try {
      const response = await fetch('http://localhost:4000/v1/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftName: product.name,
          giftUrl: giftUrl,
          price: product.price,
          registryId: selectedRegistry.id,
        }),
      })
      if (!response.ok) throw new Error('Failed to add gift')
      toast({
        title: "Success",
        description: "Gift added successfully",
      })
      setIsProductDialogOpen(false)
    } catch (error) {
      console.error('Error adding gift:', error)
      toast({
        title: "Error",
        description: "Failed to add gift",
        variant: "destructive",
      })
    }
  }

  const openProductPage = (product: Product) => {
    setSelectedProduct(product)
    setShowProductDetails(true)
  }

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryId(categoryId)
    setSelectedProduct(null)
    setShowProductDetails(false)
  }

  const handleBackToProducts = () => {
    setShowProductDetails(false)
    setSelectedProduct(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-black">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Categories</h1>
      <AnimatePresence mode="wait">
        {!showProductDetails && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Carousel className="w-full mx-auto">
              <CarouselContent>
                {categories.map(category => (
                  <CarouselItem key={category.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-shadow " 
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <CardHeader>
                        <CardTitle>{category.categoryName}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Image
                          src={category.imageUrl}
                          alt={category.categoryName}
                          width={900}
                          height={900}
                          className="rounded-md object-cover"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>
        )}
        <br />
<hr />
        {selectedCategoryId !== null && !showProductDetails && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              {categories.find(c => c.id === selectedCategoryId)?.categoryName} Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.find(c => c.id === selectedCategoryId)?.products.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105"
                  onClick={() => openProductPage(product)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={300}
                      height={300}
                      layout="responsive"
                      objectFit="cover"
                      className="rounded-t-md"
                    />
                  </CardContent>
                  <CardFooter className="justify-between p-4">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    <Button variant="outline" size="sm">
                      <ShoppingCart className="mr-2 h-4 w-4" /> View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {showProductDetails && selectedProduct && (
          <motion.div
            key="productDetails"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-12"
          >
            <Button onClick={handleBackToProducts} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  width={100}
                  height={100}
                  layout="responsive"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
                <p className="text-2xl font-bold mb-4">${selectedProduct.price.toFixed(2)}</p>
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                <Button 
                  className="w-full mb-4"
                  onClick={() => setIsProductDialogOpen(true)}
                >
                  <Gift className="mr-2 h-4 w-4" /> Add to Gift Registry
                </Button>
                {selectedProduct.subproducts && selectedProduct.subproducts.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Related Products</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProduct.subproducts.map((subproduct) => (
                        <Card 
                          key={subproduct.id} 
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => openProductPage(subproduct)}
                        >
                          <CardContent className="p-2">
                            <Image
                              src={subproduct.imageUrl}
                              alt={subproduct.name}
                              width={150}
                              height={150}
                              objectFit="cover"
                              className="rounded-md mb-2"
                            />
                            <p className="text-sm font-semibold">{subproduct.name}</p>
                            <p className="text-sm">${subproduct.price.toFixed(2)}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">{selectedProduct?.name}</DialogTitle>
            <DialogDescription className="text-gray-500">
              Add this product to your gift registry
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select onValueChange={(value) => setSelectedRegistry(registries.find(r => r.id.toString() === value) || null)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a registry" />
              </SelectTrigger>
              <SelectContent>
                {registries.map((registry) => (
                  <SelectItem key={registry.id} value={registry.id.toString()}>
                    {registry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setGiftUrl(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a gift URL" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={selectedProduct?.amazonUrl || ''}>Amazon</SelectItem>
                <SelectItem value={selectedProduct?.flipkartUrl || ''}>Flipkart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button variant="outline" className="text-black">Cancel</Button>
            </DialogClose>
            <Button 
              className="bg-black text-white"
              onClick={() => selectedProduct && handleAddGift(selectedProduct)}
            >
              <Gift className="mr-2 h-4 w-4" /> Add to Gift Registry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}