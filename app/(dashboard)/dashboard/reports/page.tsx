"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockBatchmates } from "@/lib/mock-data"
import { ENGINEERING_FIELDS, type Batchmate } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileSpreadsheet, FileText, Eye, Filter, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ReportType = "field" | "country"

export default function ReportsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [reportType, setReportType] = useState<ReportType>("field")
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [showPreview, setShowPreview] = useState(false)

  const accessibleFields =
    user?.role === "super_admin" ? ENGINEERING_FIELDS : user?.assignedField ? [user.assignedField] : []

  const accessibleBatchmates =
    user?.role === "super_admin" ? mockBatchmates : mockBatchmates.filter((b) => b.field === user?.assignedField)

  const availableCountries = useMemo(() => {
    return [...new Set(accessibleBatchmates.map((b) => b.country).filter(Boolean))].sort() as string[]
  }, [accessibleBatchmates])

  const reportData = useMemo(() => {
    let result: Batchmate[] = []

    if (reportType === "field") {
      if (selectedFields.length === 0) {
        result = accessibleBatchmates
      } else {
        result = accessibleBatchmates.filter((b) => selectedFields.includes(b.field))
      }
    } else {
      if (selectedCountry === "all") {
        result = accessibleBatchmates
      } else {
        result = accessibleBatchmates.filter((b) => b.country === selectedCountry)
      }
    }

    return result
  }, [reportType, selectedFields, selectedCountry, accessibleBatchmates])

  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]))
  }

  const handleExport = (format: "excel" | "pdf") => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: `Your report with ${reportData.length} records is being generated...`,
    })

    // Simulate export
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Report has been downloaded successfully.`,
      })
    }, 2000)
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  // Stats
  const fieldStats = accessibleFields.map((field) => ({
    field,
    count: accessibleBatchmates.filter((b) => b.field === field).length,
  }))

  const countryStats = availableCountries
    .slice(0, 10)
    .map((country) => ({
      country,
      count: accessibleBatchmates.filter((b) => b.country === country).length,
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reports</h2>
        <p className="text-muted-foreground">Generate and export alumni reports by field or country</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
                <TabsList className="w-full bg-secondary/50">
                  <TabsTrigger value="field" className="flex-1">
                    By Field
                  </TabsTrigger>
                  <TabsTrigger value="country" className="flex-1">
                    By Country
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="field" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">Select one or more fields to include in the report:</p>
                  <div className="space-y-3">
                    {accessibleFields.map((field) => (
                      <div key={field} className="flex items-center gap-2">
                        <Checkbox
                          id={`field-${field}`}
                          checked={selectedFields.includes(field)}
                          onCheckedChange={() => handleFieldToggle(field)}
                        />
                        <Label htmlFor={`field-${field}`} className="flex-1 cursor-pointer">
                          {field}
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {accessibleBatchmates.filter((b) => b.field === field).length}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {selectedFields.length === 0 && (
                    <p className="text-xs text-muted-foreground">No fields selected — all fields will be included</p>
                  )}
                </TabsContent>

                <TabsContent value="country" className="mt-4 space-y-4">
                  <p className="text-sm text-muted-foreground">Select a country for the report:</p>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border max-h-60">
                      <SelectItem value="all">All Countries</SelectItem>
                      {availableCountries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Records in report:</span>
                  <Badge className="bg-primary/10 text-primary">{reportData.length}</Badge>
                </div>

                <Button onClick={handlePreview} variant="outline" className="w-full border-border bg-transparent">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Report
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleExport("excel")}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={reportData.length === 0}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </Button>
                  <Button
                    onClick={() => handleExport("pdf")}
                    className="bg-primary hover:bg-primary/90"
                    disabled={reportData.length === 0}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Field Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fieldStats.map((stat) => (
                    <div key={stat.field} className="flex items-center gap-2">
                      <div className="w-20 text-xs text-muted-foreground truncate">{stat.field}</div>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(stat.count / Math.max(...fieldStats.map((s) => s.count))) * 100}%` }}
                        />
                      </div>
                      <div className="w-6 text-xs font-medium text-right">{stat.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-accent" />
                  Top Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {countryStats.map((stat) => (
                    <div key={stat.country} className="flex items-center gap-2">
                      <div className="w-20 text-xs text-muted-foreground truncate">{stat.country}</div>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${(stat.count / Math.max(...countryStats.map((s) => s.count))) * 100}%` }}
                        />
                      </div>
                      <div className="w-6 text-xs font-medium text-right">{stat.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Preview */}
          {showPreview && (
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Report Preview</CardTitle>
                    <CardDescription>
                      {reportType === "field"
                        ? `Fields: ${selectedFields.length > 0 ? selectedFields.join(", ") : "All"}`
                        : `Country: ${selectedCountry === "all" ? "All" : selectedCountry}`}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                    Close Preview
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto max-h-96">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                          <TableHead className="font-semibold">Full Name</TableHead>
                          <TableHead className="font-semibold">Calling Name</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">WhatsApp</TableHead>
                          <TableHead className="font-semibold">Field</TableHead>
                          <TableHead className="font-semibold">Country</TableHead>
                          <TableHead className="font-semibold">Workplace</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.slice(0, 20).map((batchmate) => (
                          <TableRow key={batchmate.id} className="hover:bg-secondary/20">
                            <TableCell className="font-medium">{batchmate.fullName}</TableCell>
                            <TableCell>{batchmate.callingName}</TableCell>
                            <TableCell>{batchmate.email}</TableCell>
                            <TableCell>{batchmate.whatsappMobile}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {batchmate.field}
                              </Badge>
                            </TableCell>
                            <TableCell>{batchmate.country || "—"}</TableCell>
                            <TableCell>{batchmate.workingPlace || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                {reportData.length > 20 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Showing 20 of {reportData.length} records in preview. Export for full data.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {!showPreview && (
            <Card className="bg-card border-border">
              <CardContent className="py-16">
                <div className="text-center">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground">Configure Your Report</h3>
                  <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                    Select fields or countries from the configuration panel, then preview or export your report
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
