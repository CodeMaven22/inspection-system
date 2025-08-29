"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, PlusCircle, User, Mail, Phone, MapPin, Shield, Users, ClipboardCheck, UserCheck, Search, ChevronLeft, ChevronRight, Eye, Edit, Trash2, PieChart } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function WorkersPage() {
  const { tokens } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    userId: null as string | null,
    userName: ""
  })
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Fetch users
  useEffect(() => {
    fetchUsers()
  }, [tokens])

  const fetchUsers = async () => {
    if (!tokens) return
    setLoading(true)
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/core/users/", {
        headers: { Authorization: `Bearer ${tokens.access}` },
      })
      setUsers(res.data.results || res.data)
    } catch (err) {
      console.error("Failed to fetch users:", err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate role counts for analytics
  const roleCounts = {
    admin: users.filter(u => u.role === "admin").length,
    inspector: users.filter(u => u.role === "inspector").length,
    worker: users.filter(u => u.role === "worker").length,
    client: users.filter(u => u.role === "client").length,
    team_leader: users.filter(u => u.role === "team_leader").length,
  }
  
  const totalUsers = users.length

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" ? true : user.role === filterRole
    return matchesSearch && matchesRole
  })

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Function to calculate pie chart segment coordinates
  const calculateSegment = (startAngle: number, percentage: number) => {
    const angle = (percentage * 360) / 100
    const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180)
    const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180)
    const x2 = 50 + 50 * Math.cos(((startAngle + angle) * Math.PI) / 180)
    const y2 = 50 + 50 * Math.sin(((startAngle + angle) * Math.PI) / 180)
    const largeArc = angle > 180 ? 1 : 0
    
    return `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!deleteDialog.userId || !tokens) return
    
    setDeleteLoading(true)
    try {
      await axios.delete(`http://127.0.0.1:8000/api/core/users/${deleteDialog.userId}/`, {
        headers: { Authorization: `Bearer ${tokens.access}` },
      })
      
      toast.success("User deleted successfully")
      setUsers(users.filter(user => user.id !== deleteDialog.userId))
      setDeleteDialog({ isOpen: false, userId: null, userName: "" })
    } catch (error: any) {
      console.error("Failed to delete user:", error)
      toast.error(error.response?.data?.detail || "Failed to delete user")
    } finally {
      setDeleteLoading(false)
    }
  }

  // Open delete confirmation dialog
  const openDeleteDialog = (userId: string, userName: string) => {
    setDeleteDialog({ isOpen: true, userId, userName })
  }

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, userId: null, userName: "" })
  }

  // Navigate to view page
  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}/details`)
  }

  // Navigate to edit page
  const handleEditUser = (userId: string) => {
    router.push(`/admin/users/${userId}/edit`)
  }

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-600">Users</h1>
        <Link href="/admin/users/new">
          <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2 shadow-md">
            <PlusCircle size={16} /> Add User
          </Button>
        </Link>
      </div>

      {/* User Analytics with Pie Chart */}
      <Card className="shadow-sm">
        <CardHeader className="bg-green-50 rounded-t-lg p-2">
          <div className="flex items-center gap-2">
            <PieChart className="text-green-700" size={20} />
            <CardTitle className="text-green-800">User Analytics</CardTitle>
          </div>
          <CardDescription>Distribution of users by role</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Pie Chart */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Admin segment */}
                <path 
                  d={calculateSegment(0, (roleCounts.admin / totalUsers) * 100)} 
                  fill="#3B82F6" 
                  stroke="white" 
                  strokeWidth="2"
                />
                {/* Inspector segment */}
                <path 
                  d={calculateSegment((roleCounts.admin / totalUsers) * 360, (roleCounts.inspector / totalUsers) * 100)} 
                  fill="#8B5CF6" 
                  stroke="white" 
                  strokeWidth="2"
                />
                {/* Worker segment */}
                <path 
                  d={calculateSegment(
                    ((roleCounts.admin + roleCounts.inspector) / totalUsers) * 360, 
                    (roleCounts.worker / totalUsers) * 100
                  )} 
                  fill="#10B981" 
                  stroke="white" 
                  strokeWidth="2"
                />
                {/* Client segment */}
                <path 
                  d={calculateSegment(
                    ((roleCounts.admin + roleCounts.inspector + roleCounts.worker) / totalUsers) * 360, 
                    (roleCounts.client / totalUsers) * 100
                  )} 
                  fill="#F59E0B" 
                  stroke="white" 
                  strokeWidth="2"
                />
                {/* Team Leader segment */}
                <path 
                  d={calculateSegment(
                    ((roleCounts.admin + roleCounts.inspector + roleCounts.worker + roleCounts.client) / totalUsers) * 360, 
                    (roleCounts.team_leader / totalUsers) * 100
                  )} 
                  fill="#EC4899" 
                  stroke="white" 
                  strokeWidth="2"
                />
                <circle cx="50" cy="50" r="30" fill="white" />
                <text x="50" y="50" textAnchor="middle" dy="0.3em" fontSize="12"  fontWeight="bold">
                  {totalUsers} Users
                </text>
              </svg>
            </div>
            
            {/* Legend and Stats */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Admins</span>
                    <span className="text-sm font-bold">{roleCounts.admin}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(roleCounts.admin / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-purple-500 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Inspectors</span>
                    <span className="text-sm font-bold">{roleCounts.inspector}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${(roleCounts.inspector / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Workers</span>
                    <span className="text-sm font-bold">{roleCounts.worker}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(roleCounts.worker / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-amber-500 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Clients</span>
                    <span className="text-sm font-bold">{roleCounts.client}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${(roleCounts.client / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-pink-500 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Team Leaders</span>
                    <span className="text-sm font-bold">{roleCounts.team_leader}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-pink-500 h-2 rounded-full" 
                      style={{ width: `${(roleCounts.team_leader / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter and Search */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="inspector">Inspectors</SelectItem>
                <SelectItem value="worker">Workers</SelectItem>
                <SelectItem value="team_leader">Team Leaders</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-2">
            <div className="space-y-1">
              <CardTitle className="text-green-800"><Users className="h-5 w-5" />All Users</CardTitle>
              <CardDescription>Manage users by role and details.</CardDescription>
            </div>
            <div className="mt-2 md:mt-0 text-sm text-gray-500">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100">
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Email</TableHead>
                <TableHead className="font-semibold text-gray-700">Role</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? currentItems.map(user => (
                <TableRow key={user.id} className="hover:bg-green-50 transition-colors border-b">
                  <TableCell className="font-medium">{`${user.first_name} ${user.last_name}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 
                        user.role === 'inspector' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'worker' ? 'bg-green-100 text-green-800' :
                        user.role === 'team_leader' ? 'bg-pink-100 text-pink-800' :
                        'bg-amber-100 text-amber-800'}`}
                    >
                      {user.role.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-blue-500 hover:bg-blue-100"
                        onClick={() => handleViewUser(user.id)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-green-600 hover:bg-green-100"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:bg-red-100"
                        onClick={() => openDeleteDialog(user.id, `${user.first_name} ${user.last_name}`)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {filteredUsers.length > itemsPerPage && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteDialog.userName}? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  )
}
