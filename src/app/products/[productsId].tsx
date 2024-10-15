'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  price: number
  imageUrl: string
  description?: string
  subproducts?: Product[]
}

export default function ProductPage({ params }: { params: { productId: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (params.productId) {
      fetchProductById(params.productId)
    }
  }, [params.productId])

  const fetchProductById = async (id: string) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/products/${id}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  }

  if (!product) return <div>Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-black">
      <Button onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative w-full h-[500px]"> {/* Increased height for main product image */}
          <Image
            src={product.imageUrl}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
        </div>
      </div>

      {product.subproducts && product.subproducts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Related Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.subproducts.map((subproduct) => (
              <Card 
                key={subproduct.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{subproduct.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative w-full h-[150px]"> {/* Decreased height for subproduct images */}
                    <Image
                      src={subproduct.imageUrl}
                      alt={subproduct.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-md"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-between p-4">
                  <span className="font-bold text-lg">${subproduct.price.toFixed(2)}</span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
