"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { mockUsers } from "@/lib/mock-data"
import { type User, ENGINEERING_FIELDS, type EngineeringField } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Edit, Trash2, Shield, Users, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { redirect } from "next/navigation"

export default function UsersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    assignedField: "" as EngineeringField | "",
  })

  // Only super admins can access this page
  if (user?.role !== "super_admin") {
    redirect("/dashboard")
  }

  const fieldAdmins = users.filter((u) => u.role === "field_admin")
  const superAdmins = users.filter((u) => u.role === "super_admin")

  const handleOpenDialog = (userToEdit?: User) => {
    if (userToEdit) {
      setEditingUser(userToEdit)
      setFormData({
        email: userToEdit.email,
        username: userToEdit.username,
        password: "",
        assignedField: userToEdit.assignedField || "",
      })
    } else {
      setEditingUser(null)
      setFormData({
        email: "",
        username: "",
        password: "",
        assignedField: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                email: formData.email,
                username: formData.username,
                assignedField: formData.assignedField as EngineeringField,
              }
            : u,
        ),
      )
      toast({
        title: "User updated",
        description: `${formData.username} has been updated successfully.`,
      })
    } else {
      const newUser: User = {
        id: `new-${Date.now()}`,
        email: formData.email,
        username: formData.username,
        role: "field_admin",
        assignedField: formData.assignedField as EngineeringField,
        createdAt: new Date().toISOString(),
      }
      setUsers((prev) => [...prev, newUser])
      toast({
        title: "User created",
        description: `${formData.username} has been added as a Field Admin.`,
      })
    }

    setIsLoading(false)
    setIsDialogOpen(false)
  }

  const handleDelete = async (userToDelete: User) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id))
    toast({
      title: "User deleted",
      description: `${userToDelete.username} has been removed.`,
    })
  }

  // Check which fields are already assigned
  const assignedFields = new Set(fieldAdmins.map((u) => u.assignedField))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground">Manage Field Admin accounts and their assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Field Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit Field Admin" : "Add Field Admin"}</DialogTitle>
                <DialogDescription>
                  {editingUser ? "Update the field admin details below." : "Create a new field admin account."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                    className="bg-input border-border"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-input border-border"
                    required
                  />
                </div>
                {!editingUser && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      className="bg-input border-border"
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="field">Assigned Field</Label>
                  <Select
                    value={formData.assignedField}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, assignedField: value as EngineeringField }))
                    }
                    required
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {ENGINEERING_FIELDS.map((field) => (
                        <SelectItem
                          key={field}
                          value={field}
                          disabled={assignedFields.has(field) && editingUser?.assignedField !== field}
                        >
                          {field}
                          {assignedFields.has(field) && editingUser?.assignedField !== field && " (Assigned)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingUser ? "Updating..." : "Creating..."}
                    </>
                  ) : editingUser ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Super Admins */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Super Admins
            </CardTitle>
            <CardDescription>Users with full system access ({superAdmins.length})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {superAdmins.map((admin) => (
                <div key={admin.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{admin.username}</p>
                    <p className="text-sm text-muted-foreground">{admin.email}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/30">Super Admin</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Field Admins Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Field Admin Overview
            </CardTitle>
            <CardDescription>Field assignments ({fieldAdmins.length} of 9 assigned)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {ENGINEERING_FIELDS.map((field) => {
                const assigned = fieldAdmins.find((u) => u.assignedField === field)
                return (
                  <div
                    key={field}
                    className={`p-3 rounded-lg text-center ${
                      assigned ? "bg-accent/10 border border-accent/30" : "bg-secondary/30 border border-transparent"
                    }`}
                  >
                    <p className="text-xs font-medium">{field}</p>
                    <p className={`text-xs mt-1 ${assigned ? "text-accent" : "text-muted-foreground"}`}>
                      {assigned ? "Assigned" : "Vacant"}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Admins Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Field Administrators</CardTitle>
          <CardDescription>Manage individual field admin accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Assigned Field</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <p className="text-muted-foreground">No field admins yet</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  fieldAdmins.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-secondary/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-accent">
                              {admin.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{admin.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-accent/30 text-accent bg-accent/5">
                          {admin.assignedField}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem onClick={() => handleOpenDialog(admin)} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(admin)}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
