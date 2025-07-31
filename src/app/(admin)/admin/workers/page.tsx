"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react"
import type { User } from "@/types/auth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function WorkersPage() {
  const [workers, setWorkers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newWorker, setNewWorker] = useState<Partial<User>>({
    first_name: "",
    last_name: "",
    email: "",
    role: "worker"
  })

  useEffect(() => {
    // Simulate fetching workers from an API
    const fetchWorkers = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
      const mockWorkers: User[] = [
        { id: "1", first_name: "John", last_name: "Doe", email: "john.doe@example.com", role: "worker" },
        { id: "2", first_name: "Jane", last_name: "Smith", email: "jane.smith@example.com", role: "inspector" },
        { id: "3", first_name: "Peter", last_name: "Jones", email: "peter.jones@example.com", role: "team_leader" },
        { id: "4", first_name: "Alice", last_name: "Brown", email: "alice.brown@example.com", role: "worker" },
        { id: "5", first_name: "Bob", last_name: "White", email: "bob.white@example.com", role: "inspector" },
        { id: "6", first_name: "Charlie", last_name: "Green", email: "charlie.green@example.com", role: "admin" },
      ]
      setWorkers(mockWorkers)
      setLoading(false)
    }
    fetchWorkers()
  }, [])

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddWorker = () => {
    // In a real app, you would call an API here
    const newWorkerWithId = {
      ...newWorker,
      id: (workers.length + 1).toString()
    } as User
    
    setWorkers([...workers, newWorkerWithId])
    setIsDialogOpen(false)
    setNewWorker({
      first_name: "",
      last_name: "",
      email: "",
      role: "worker"
    })
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Workers</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Worker
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Worker</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="first_name" className="text-right">
                    First Name
                  </Label>
                  <Input
                    id="first_name"
                    value={newWorker.first_name}
                    onChange={(e) => setNewWorker({...newWorker, first_name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="last_name" className="text-right">
                    Last Name
                  </Label>
                  <Input
                    id="last_name"
                    value={newWorker.last_name}
                    onChange={(e) => setNewWorker({...newWorker, last_name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newWorker.email}
                    onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={newWorker.role}
                    onValueChange={(value) => setNewWorker({...newWorker, role: value as any})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worker">Worker</SelectItem>
                      <SelectItem value="inspector">Inspector</SelectItem>
                      <SelectItem value="team_leader">Team Leader</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleAddWorker}
                  disabled={!newWorker.first_name || !newWorker.last_name || !newWorker.email}
                >
                  Add Worker
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Workers</CardTitle>
          <CardDescription>Manage your team members and their roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium">{`${worker.first_name} ${worker.last_name}`}</TableCell>
                    <TableCell>{worker.email}</TableCell>
                    <TableCell className="capitalize">{worker.role.replace(/_/g, " ")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No workers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

















// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react"
// import type { User } from "@/types/auth"

// export default function WorkersPage() {
//   const [workers, setWorkers] = useState<User[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")

//   useEffect(() => {
//     // Simulate fetching workers from an API
//     const fetchWorkers = async () => {
//       setLoading(true)
//       await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
//       const mockWorkers: User[] = [
//         { id: "1", first_name: "John", last_name: "Doe", email: "john.doe@example.com", role: "worker" },
//         { id: "2", first_name: "Jane", last_name: "Smith", email: "jane.smith@example.com", role: "inspector" },
//         { id: "3", first_name: "Peter", last_name: "Jones", email: "peter.jones@example.com", role: "team_leader" },
//         { id: "4", first_name: "Alice", last_name: "Brown", email: "alice.brown@example.com", role: "worker" },
//         { id: "5", first_name: "Bob", last_name: "White", email: "bob.white@example.com", role: "inspector" },
//         { id: "6", first_name: "Charlie", last_name: "Green", email: "charlie.green@example.com", role: "admin" },
//       ]
//       setWorkers(mockWorkers)
//       setLoading(false)
//     }
//     fetchWorkers()
//   }, [])

//   const filteredWorkers = workers.filter(
//     (worker) =>
//       worker.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       worker.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       worker.role.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   if (loading) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-green-600" />
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-6 p-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold tracking-tight">Workers</h1>
//         <div className="flex items-center gap-2">
//           <Input
//             placeholder="Search workers..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="max-w-sm"
//           />
//           <Button asChild className="bg-green-600 hover:bg-green-700">
//             <Link href="/admin/workers/new">
//               <PlusCircle className="mr-2 h-4 w-4" />
//               Add Worker
//             </Link>
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All Workers</CardTitle>
//           <CardDescription>Manage your team members and their roles.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredWorkers.length > 0 ? (
//                 filteredWorkers.map((worker) => (
//                   <TableRow key={worker.id}>
//                     <TableCell className="font-medium">{`${worker.first_name} ${worker.last_name}`}</TableCell>
//                     <TableCell>{worker.email}</TableCell>
//                     <TableCell className="capitalize">{worker.role.replace(/_/g, " ")}</TableCell>
//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button aria-haspopup="true" size="icon" variant="ghost">
//                             <MoreHorizontal className="h-4 w-4" />
//                             <span className="sr-only">Toggle menu</span>
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem>Edit</DropdownMenuItem>
//                           <DropdownMenuItem>Delete</DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={4} className="h-24 text-center">
//                     No workers found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
