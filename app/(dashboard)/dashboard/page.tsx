"use client"

import { useAuth } from "@/lib/auth-context"
import { mockBatchmates } from "@/lib/mock-data"
import { ENGINEERING_FIELDS } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Globe, Building2, TrendingUp, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user } = useAuth()

  // Filter batchmates based on user role
  const accessibleBatchmates =
    user?.role === "super_admin" ? mockBatchmates : mockBatchmates.filter((b) => b.field === user?.assignedField)

  // Calculate stats
  const totalAlumni = accessibleBatchmates.length
  const countriesCount = new Set(accessibleBatchmates.map((b) => b.country).filter(Boolean)).size
  const workplacesCount = new Set(accessibleBatchmates.map((b) => b.workingPlace).filter(Boolean)).size

  const fieldStats = ENGINEERING_FIELDS.map((field) => ({
    field,
    count: mockBatchmates.filter((b) => b.field === field).length,
  }))

  const recentBatchmates = accessibleBatchmates.slice(0, 5)

  const stats = [
    {
      title: "Total Alumni",
      value: totalAlumni,
      description: user?.role === "super_admin" ? "Across all fields" : `In ${user?.assignedField}`,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Fields",
      value: user?.role === "super_admin" ? 9 : 1,
      description: "Engineering branches",
      icon: UserCheck,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Countries",
      value: countriesCount,
      description: "Global presence",
      icon: Globe,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Workplaces",
      value: workplacesCount,
      description: "Organizations",
      icon: Building2,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Field Distribution */}
        {user?.role === "super_admin" && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Field Distribution</CardTitle>
              <CardDescription>Alumni count per engineering field</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fieldStats.map((stat) => (
                  <div key={stat.field} className="flex items-center gap-3">
                    <div className="w-24 text-sm text-muted-foreground">{stat.field}</div>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(stat.count / Math.max(...fieldStats.map((s) => s.count))) * 100}%` }}
                      />
                    </div>
                    <div className="w-8 text-sm font-medium text-right">{stat.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Alumni */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Alumni</CardTitle>
              <CardDescription>Latest additions to the network</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/batchmates" className="text-primary">
                View all
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBatchmates.map((batchmate) => (
                <div key={batchmate.id} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{batchmate.callingName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{batchmate.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {batchmate.field} • {batchmate.country || "Unknown location"}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">{batchmate.workingPlace || "N/A"}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className={`bg-card border-border ${user?.role !== "super_admin" ? "lg:col-span-1" : ""}`}>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="justify-start h-auto py-4 bg-secondary/30 border-border hover:bg-secondary/50"
                asChild
              >
                <Link href="/dashboard/batchmates/new">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Add Batchmate</p>
                      <p className="text-xs text-muted-foreground">Create new record</p>
                    </div>
                  </div>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto py-4 bg-secondary/30 border-border hover:bg-secondary/50"
                asChild
              >
                <Link href="/dashboard/search">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <TrendingUp className="h-4 w-4 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Global Search</p>
                      <p className="text-xs text-muted-foreground">Find alumni</p>
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
