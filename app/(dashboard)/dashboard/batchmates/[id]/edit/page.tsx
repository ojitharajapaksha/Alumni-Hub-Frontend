"use client"

import { use } from "react"
import Link from "next/link"
import { mockBatchmates } from "@/lib/mock-data"
import { BatchmateForm } from "@/components/dashboard/batchmate-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditBatchmatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const batchmate = mockBatchmates.find((b) => b.id === id)

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
          <Link href={`/dashboard/batchmates/${id}`}>
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
