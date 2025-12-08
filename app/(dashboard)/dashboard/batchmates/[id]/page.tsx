"use client"

import { use } from "react"
import Link from "next/link"
import { mockBatchmates } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Mail, Phone, MapPin, Building2, Globe } from "lucide-react"

export default function BatchmateDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/batchmates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href={`/dashboard/batchmates/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="bg-card border-border lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={batchmate.currentPhoto || "/placeholder.svg"} alt={batchmate.fullName} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {batchmate.callingName?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{batchmate.fullName}</h3>
              <p className="text-muted-foreground">{batchmate.callingName}</p>
              {batchmate.nickName && <p className="text-sm text-muted-foreground">"{batchmate.nickName}"</p>}
              <Badge className="mt-3 bg-primary/10 text-primary border-primary/30">{batchmate.field}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{batchmate.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-medium">{batchmate.whatsappMobile}</p>
                </div>
              </div>
              {batchmate.mobile && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile</p>
                    <p className="font-medium">{batchmate.mobile}</p>
                  </div>
                </div>
              )}
              {batchmate.country && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{batchmate.country}</p>
                  </div>
                </div>
              )}
              {batchmate.workingPlace && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Workplace</p>
                    <p className="font-medium">{batchmate.workingPlace}</p>
                  </div>
                </div>
              )}
              {batchmate.address && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{batchmate.address}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Photos Card */}
        {(batchmate.universityPhoto || batchmate.currentPhoto) && (
          <Card className="bg-card border-border lg:col-span-3">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                {batchmate.universityPhoto && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">University Photo</p>
                    <img
                      src={batchmate.universityPhoto || "/placeholder.svg"}
                      alt="University"
                      className="rounded-lg border border-border w-full max-w-sm"
                    />
                  </div>
                )}
                {batchmate.currentPhoto && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Current Photo</p>
                    <img
                      src={batchmate.currentPhoto || "/placeholder.svg"}
                      alt="Current"
                      className="rounded-lg border border-border w-full max-w-sm"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
