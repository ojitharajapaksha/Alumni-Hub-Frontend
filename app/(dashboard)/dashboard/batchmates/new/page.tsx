"use client"

import { BatchmateForm } from "@/components/dashboard/batchmate-form"

export default function NewBatchmatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Add New Batchmate</h2>
        <p className="text-muted-foreground">Create a new alumni record</p>
      </div>

      <BatchmateForm />
    </div>
  )
}
