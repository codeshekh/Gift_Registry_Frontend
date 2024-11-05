'use client'

import { useEffect, useState } from "react"
import { Loader2, Plus, Link as LinkIcon, Trash2, Edit2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import  Input  from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "react-toastify"

interface GiftComponentProps {
  registryId: number
  onBuyGift: (giftId: number) => Promise<void>
}

interface Gift {
  id: number
  giftName: string
  giftUrl?: string
  price: number
  Image?: string
  giftStatus: boolean
}

export default function GiftComponent({ registryId, onBuyGift }: GiftComponentProps) {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(false)
  const [isAddingGift, setIsAddingGift] = useState(false)
  const [isEditingGift, setIsEditingGift] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [manualInput, setManualInput] = useState({
    id: 0,
    giftName: "",
    price: "",
    Image: "",
    giftUrl: "",
  })
  const [isUrlMode, setIsUrlMode] = useState(true)

  const fetchGifts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gifts/gift-list/${registryId}`)
      if (!response.ok) throw new Error("Failed to fetch gifts")
      const data = await response.json()
      setGifts(data)
    } catch (error) {
      toast.error("Failed to load gifts")
      console.error(error)
    }
  }

  useEffect(() => {
    fetchGifts()
  }, [registryId])

  const handleUrlSubmit = async () => {
    setLoading(true)
    try {
      console.log("Fetching product details from:", urlInput)
      const scraperResponse = await fetch(`/api/scraper?url=${encodeURIComponent(urlInput)}`)
      if (!scraperResponse.ok) {
        const errorText = await scraperResponse.text()
        throw new Error(`Failed to fetch product details: ${errorText}`)
      }
      const productData = await scraperResponse.json()
      console.log("Scraped product data:", productData)

      if (!productData.productName || !productData.productPrice || !productData.productImage) {
        throw new Error("Incomplete product data received from scraper")
      }

      console.log("Sending gift data to API")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gifts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giftName: productData.productName,
          giftUrl: urlInput,
          price: parseFloat(productData.productPrice.replace(/[^0-9.]/g, '')),
          registryId,
          Image: productData.productImage,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to add gift: ${errorText}`)
      }
      
      await fetchGifts()
      setIsAddingGift(false)
      setUrlInput("")
      toast.success("Gift added successfully")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleManualSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gifts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...manualInput,
          price: parseFloat(manualInput.price),
          registryId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to add gift: ${errorText}`)
      }
      
      await fetchGifts()
      setIsAddingGift(false)
      setManualInput({ id: 0, giftName: "", price: "", Image: "", giftUrl: "" })
      toast.success("Gift added successfully")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gifts/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to delete gift: ${errorText}`)
      }
      await fetchGifts()
      toast.success("Gift deleted successfully")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Failed to delete gift")
      }
      console.error(error)
    }
  }

  const handleUpdate = async (id: number, status: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gifts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          giftStatus: status,
        }),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update gift: ${errorText}`)
      }
      await fetchGifts()
      toast.success("Gift updated successfully")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Failed to update gift")
      }
      console.error(error)
    }
  }

  const handleEdit = (gift: Gift) => {
    setManualInput({
      id: gift.id,
      giftName: gift.giftName,
      price: gift.price.toString(),
      Image: gift.Image || "",
      giftUrl: gift.giftUrl || "",
    })
    setIsEditingGift(true)
    setIsUrlMode(false)
  }

  const handleEditSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/gifts/${manualInput.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...manualInput,
          price: parseFloat(manualInput.price),
          registryId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update gift: ${errorText}`)
      }
      
      await fetchGifts()
      setIsEditingGift(false)
      setManualInput({ id: 0, giftName: "", price: "", Image: "", giftUrl: "" })
      toast.success("Gift updated successfully")
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gift Registry</h2>
        <Dialog open={isAddingGift} onOpenChange={setIsAddingGift}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Gift
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a Gift</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant={isUrlMode ? "default" : "outline"}
                  onClick={() => setIsUrlMode(true)}
                >
                  Add by URL
                </Button>
                <Button
                  variant={!isUrlMode ? "default" : "outline"}
                  onClick={() => setIsUrlMode(false)}
                >
                  Add Manually
                </Button>
              </div>

              {isUrlMode ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Product URL</Label>
                    <Input
                      id="url"
                      placeholder="Enter Amazon or Flipkart URL"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleUrlSubmit}
                    disabled={loading || !urlInput}
                    className="w-full"
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Add Gift
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Gift Name</Label>
                    <Input
                      id="name"
                      value={manualInput.giftName}
                      onChange={(e) =>
                        setManualInput({ ...manualInput, giftName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={manualInput.price}
                      onChange={(e) =>
                        setManualInput({ ...manualInput, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={manualInput.Image}
                      onChange={(e) =>
                        setManualInput({ ...manualInput, Image: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="giftUrl">Gift URL (optional)</Label>
                    <Input
                      id="giftUrl"
                      value={manualInput.giftUrl}
                      onChange={(e) =>
                        setManualInput({ ...manualInput, giftUrl: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    onClick={isEditingGift ? handleEditSubmit : handleManualSubmit}
                    disabled={loading || !manualInput.giftName || !manualInput.price}
                    className="w-full"
                  >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isEditingGift ? "Update Gift" : "Add Gift"}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Gift Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gifts.map((gift) => (
            <TableRow key={gift.id}>
              <TableCell>
                {gift.Image ? (
                  <Image
                    src={gift.Image}
                    alt={gift.giftName}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded-md" />
                )}
              </TableCell>
              <TableCell>
                <div className="font-medium">{gift.giftName}</div>
                {gift.giftUrl && (
                  <a
                    href={gift.giftUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground flex items-center hover:text-primary"
                  >
                    <LinkIcon className="w-3 h-3 mr-1" />
                    View Product
                  </a>
                )}
              </TableCell>
              <TableCell>${gift.price.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant={gift.giftStatus ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdate(gift.id, !gift.giftStatus)}
                >
                  {gift.giftStatus ? "Purchased" : "Mark as Purchased"}
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(gift.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(gift)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}