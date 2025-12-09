"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { batchmateService } from "@/lib/api/services/batchmate.service"
import { type Batchmate } from "@/lib/types"
import { BatchmateForm } from "@/components/dashboard/batchmate-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function EditBatchmatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [batchmate, setBatchmate] = useState<Batchmate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBatchmate = async () => {
      try {
        setIsLoading(true)
        const data = await batchmateService.getById(id)
        setBatchmate(data)
      } catch (error) {
        console.error("Error fetching batchmate:", error)
        toast.error("Failed to load batchmate details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBatchmate()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!batchmate) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">Batchmate not found</p>
        <Button variant="link" asChild className="mt-4">
          <Link href="/dashboard/batchmates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href={`/dashboard/batchmates/${batchmate.documentId || batchmate.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Edit Batchmate</h2>
          <p className="text-muted-foreground">Update {batchmate.fullName}'s record</p>
        </div>
      </div>

      <BatchmateForm initialData={batchmate} />
    </div>
  )
}
